import { graphqlRequest, GraphQLError } from '@/lib/graphqlClient';

export interface EventSummary {
  id: string;
  slug?: string | null;
  title: string;
  description?: string | null;
  cover_url?: string | null;
  city?: string | null;
  state?: string | null;
  start_at?: string | null;
  end_at?: string | null;
  base_price_cents?: number | null;
  status?: string | null;
  visibility?: string | null;
}

export interface EventDetail extends EventSummary {
  venue_name?: string | null;
  street?: string | null;
  country?: string | null;
  timezone?: string | null;
  owner_id?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  published_at?: string | null;
}

export interface EventCategory {
  id: string;
  name: string;
  slug?: string | null;
}

export interface SearchEventsParams {
  searchTerm?: string;
  city?: string;
  limit?: number;
  offset?: number;
}

const SEARCH_EVENTS_QUERY = /* GraphQL */ `
  query SearchEvents($where: events_bool_exp!, $limit: Int = 20, $offset: Int = 0) {
    events(where: $where, order_by: { start_at: desc_nulls_last, created_at: desc }, limit: $limit, offset: $offset) {
      id
      slug
      title
      description
      cover_url
      city
      state
      start_at
      end_at
      base_price_cents
      status
      visibility
    }
  }
`;

const PHOTOGRAPHER_EVENTS_QUERY = /* GraphQL */ `
  query PhotographerEvents($where: events_bool_exp!, $limit: Int = 50) {
    events(where: $where, order_by: { start_at: desc_nulls_last, created_at: desc }, limit: $limit) {
      id
      slug
      title
      description
      city
      state
      start_at
      status
      base_price_cents
      cover_url
    }
  }
`;

const EVENT_BY_ID_QUERY = /* GraphQL */ `
  query EventById($id: uuid!) {
    events_by_pk(id: $id) {
      id
      slug
      title
      description
      cover_url
      city
      state
      street
      venue_name
      start_at
      end_at
      base_price_cents
      status
      visibility
      owner_id
      created_at
      updated_at
      published_at
    }
  }
`;

const EVENT_BY_SLUG_QUERY = /* GraphQL */ `
  query EventBySlug($slug: String!) {
    events(where: { slug: { _eq: $slug } }, limit: 1) {
      id
      slug
      title
      description
      cover_url
      city
      state
      street
      venue_name
      start_at
      end_at
      base_price_cents
      status
      visibility
      owner_id
      created_at
      updated_at
      published_at
    }
  }
`;

const LIST_EVENT_CATEGORIES_QUERY = /* GraphQL */ `
  query EventCategories {
    event_categories(order_by: { name: asc }) {
      id
      name
      slug
    }
  }
`;

const CREATE_EVENT_MUTATION = /* GraphQL */ `
  mutation CreateEvent($object: events_insert_input!) {
    insert_events_one(object: $object) {
      id
      slug
      title
      start_at
      city
      state
    }
  }
`;

const DELETE_EVENT_MUTATION = /* GraphQL */ `
  mutation DeleteEvent($id: uuid!) {
    delete_events_by_pk(id: $id) {
      id
    }
  }
`;

const DEFAULT_EVENT_STATUSES = ["active", "scheduled", "completed"];

function buildSearchWhere(params: SearchEventsParams) {
  const filters: Record<string, unknown>[] = [
    { status: { _in: DEFAULT_EVENT_STATUSES } },
  ];

  if (params.city) {
    filters.push({ city: { _ilike: params.city } });
  }

  const term = params.searchTerm?.trim();
  if (term) {
    const pattern = `%${term.replace(/\s+/g, "%")}%`;
    filters.push({
      _or: [
        { title: { _ilike: pattern } },
        { description: { _ilike: pattern } },
        { city: { _ilike: pattern } },
      ],
    });
  }

  return { _and: filters };
}

export async function searchEvents(params: SearchEventsParams = {}, signal?: AbortSignal) {
  const where = buildSearchWhere(params);
  const data = await graphqlRequest<{ events: EventSummary[] }>(
    SEARCH_EVENTS_QUERY,
    {
      where,
      limit: params.limit ?? 20,
      offset: params.offset ?? 0,
    },
    {
      useAdminSecret: true,
      signal,
    }
  );
  return data.events;
}

export async function listPhotographerEvents(ownerId: string, token: string, signal?: AbortSignal) {
  const where = {
    _and: [
      { owner_id: { _eq: ownerId } },
      { status: { _nlike: "archived" } },
    ],
  } as const;

  const data = await graphqlRequest<{ events: EventSummary[] }>(
    PHOTOGRAPHER_EVENTS_QUERY,
    {
      where,
      limit: 100,
    },
    {
      token,
      signal,
    }
  );
  return data.events;
}

export async function getEventById(id: string, token?: string | null, signal?: AbortSignal) {
  const data = await graphqlRequest<{ events_by_pk: EventDetail | null }>(
    EVENT_BY_ID_QUERY,
    { id },
    {
      token: token ?? undefined,
      useAdminSecret: token ? false : true,
      signal,
    }
  );
  return data.events_by_pk;
}

export async function getEventBySlug(slug: string, token?: string | null, signal?: AbortSignal) {
  const data = await graphqlRequest<{ events: EventDetail[] }>(
    EVENT_BY_SLUG_QUERY,
    { slug },
    {
      token: token ?? undefined,
      useAdminSecret: token ? false : true,
      signal,
    }
  );
  return data.events[0] ?? null;
}

export async function listEventCategories(token?: string | null, signal?: AbortSignal) {
  const data = await graphqlRequest<{ event_categories: EventCategory[] }>(
    LIST_EVENT_CATEGORIES_QUERY,
    {},
    {
      token: token ?? undefined,
      useAdminSecret: token ? false : true,
      signal,
    }
  );
  return data.event_categories;
}

export interface CreateEventInput {
  title: string;
  description?: string | null;
  start_at: string;
  end_at?: string | null;
  city?: string | null;
  state?: string | null;
  venue_name?: string | null;
  base_price_cents?: number | null;
  owner_id: string;
  status?: string;
  visibility?: string;
  category_id: string;
  slug?: string;
}

function generateEventSlug(title: string) {
  const baseSlug = title
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);

  const uniqueSuffix = Math.random().toString(36).slice(2, 8);
  const sanitizedBase = baseSlug || 'evento';

  return `${sanitizedBase}-${uniqueSuffix}`;
}

export async function createEvent(input: CreateEventInput, token: string) {
  try {
    const slug = input.slug ?? generateEventSlug(input.title);
    const data = await graphqlRequest<{ insert_events_one: EventSummary }>(
      CREATE_EVENT_MUTATION,
      {
        object: {
          ...input,
          slug,
        },
      },
      {
        token,
      }
    );
    return data.insert_events_one;
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw new Error(error.message);
    }
    throw error;
  }
}

export async function deleteEvent(id: string, token: string) {
  try {
    await graphqlRequest<{ delete_events_by_pk: { id: string } | null }>(
      DELETE_EVENT_MUTATION,
      { id },
      {
        token,
      }
    );
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw new Error(error.message);
    }
    throw error;
  }
}

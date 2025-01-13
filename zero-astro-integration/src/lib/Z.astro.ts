import { Zero, type TableSchema, type ZeroOptions } from '@rocicorp/zero';

export type Schema = {
  readonly version: number;
  readonly tables: { readonly [table: string]: TableSchema };
};

export type ZeroConfig = {
  url: string;
  authToken?: string;
  schema?: any;
  userID?: string;
}

export type ZeroClient = Zero<Schema>;

let client: Zero<Schema> | null = null;

export async function getZeroClient(config?: ZeroConfig): Promise<Zero<Schema> {
  if (client) return client;
  
  const zeroUrl = config?.url || import.meta.env.PUBLIC_ZERO_URL;
  const authToken = config?.authToken || import.meta.env.PUBLIC_ZERO_AUTH_TOKEN;
  const userID = config?.userID || import.meta.env.PUBLIC_ZERO_USER_ID || 'default-user';
  
  if (!zeroUrl) {
    throw new ZeroError('Missing ZERO_URL configuration');
  }
  
  client = new Zero<Schema>({
    server: zeroUrl,
    auth: authToken,
    userID: userID,
    schema: config?.schema,
    logLevel: 'error'
  });

  return client;
}

export class ZeroError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ZeroError';
  }
}

export class Z<TSchema extends Schema> {
  private _zero: Zero<TSchema>;

  constructor(options: ZeroOptions<TSchema>) {
    this._zero = this.build(options)
  }

  build(z_options: ZeroOptions<TSchema>): Zero<TSchema> {
    return new Zero(z_options);
  }

  close() {
    this._zero.close();
  }
}

export async function cleanup() {
  if (client) {
    client.close();
    client = null;
  }
}

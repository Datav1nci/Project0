import oracledb from 'oracledb';
import DatabaseService from '../lib/database';
import { Client } from '../types';

export class ClientService {
  private db: DatabaseService;

  constructor() {
    this.db = new DatabaseService();
  }

  async getClients(
    search: string = '',
    page: number = 1,
    limit: number = 10,
    sort: string = 'name',
    order: 'asc' | 'desc' = 'asc'
  ): Promise<{ clients: Client[]; total: number }> {
    const offset = (page - 1) * limit;
    const query = `
      SELECT c.*, COUNT(*) OVER() as total_count
      FROM clients c
      WHERE LOWER(c.name) LIKE LOWER(:search)
         OR LOWER(c.email) LIKE LOWER(:search)
         OR LOWER(c.phone) LIKE LOWER(:search)
      ORDER BY ${sort} ${order}
      FETCH FIRST :limit ROWS ONLY OFFSET :offset
    `;
    const binds = { search: `%${search}%`, limit, offset };
    const result = await this.db.execute<Client & { total_count: number }>(query, binds);
    const total = result.rows?.[0]?.total_count || 0;
    const clients = result.rows?.map(({ total_count, ...client }) => client) || [];
    return { clients, total };
  }

  async createClient(client: Omit<Client, 'id' | 'created_at' | 'updated_at'>): Promise<Client> {
    const query = `
      INSERT INTO clients (name, email, phone, business_type, address)
      VALUES (:name, :email, :phone, :business_type, :address)
      RETURNING id, name, email, phone, business_type, address, created_at, updated_at INTO :output
    `;
    const binds = {
      ...client,
      output: { type: oracledb.DB_TYPE_OBJECT, dir: oracledb.BIND_OUT },
    };
    const result = await this.db.execute(query, binds);
    return result.outBinds?.output as Client;
  }

  async updateClient(id: number, client: Partial<Client>): Promise<Client> {
    const query = `
      UPDATE clients
      SET name = COALESCE(:name, name),
          email = COALESCE(:email, email),
          phone = COALESCE(:phone, phone),
          business_type = COALESCE(:business_type, business_type),
          address = COALESCE(:address, address),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = :id
      RETURNING id, name, email, phone, business_type, address, created_at, updated_at INTO :output
    `;
    const binds = {
      id,
      ...client,
      output: { type: oracledb.DB_TYPE_OBJECT, dir: oracledb.BIND_OUT },
    };
    const result = await this.db.execute(query, binds);
    return result.outBinds?.output as Client;
  }

  async deleteClient(id: number): Promise<void> {
    const query = 'DELETE FROM clients WHERE id = :id';
    await this.db.execute(query, { id });
  }
}
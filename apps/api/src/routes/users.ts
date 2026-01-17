import { FastifyInstance } from 'fastify';

interface User {
  id: string;
  first_name: string;
  last_name: string;
  created_at: string;
  updated_at: string;
}

interface CreateUserBody {
  first_name: string;
  last_name: string;
}

interface UpdateUserBody {
  first_name?: string;
  last_name?: string;
}

export async function usersRoutes(fastify: FastifyInstance) {
  // GET /users - List all users
  fastify.get('/users', async (request, reply) => {
    try {
      const result = await fastify.pg.query<User>(
        'SELECT id, first_name, last_name, created_at, updated_at FROM users ORDER BY created_at DESC'
      );
      return { users: result.rows };
    } catch (err) {
      reply.code(500);
      return {
        error: 'Failed to fetch users',
        message: err instanceof Error ? err.message : 'Unknown error',
      };
    }
  });

  // GET /users/:id - Get a single user
  fastify.get<{ Params: { id: string } }>('/users/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const result = await fastify.pg.query<User>(
        'SELECT id, first_name, last_name, created_at, updated_at FROM users WHERE id = $1',
        [id]
      );

      if (result.rows.length === 0) {
        reply.code(404);
        return { error: 'User not found' };
      }

      return { user: result.rows[0] };
    } catch (err) {
      reply.code(500);
      return {
        error: 'Failed to fetch user',
        message: err instanceof Error ? err.message : 'Unknown error',
      };
    }
  });

  // POST /users - Create a new user
  fastify.post<{ Body: CreateUserBody }>('/users', async (request, reply) => {
    try {
      const { first_name, last_name } = request.body;

      if (!first_name || !last_name) {
        reply.code(400);
        return { error: 'first_name and last_name are required' };
      }

      const result = await fastify.pg.query<User>(
        `INSERT INTO users (first_name, last_name)
         VALUES ($1, $2)
         RETURNING id, first_name, last_name, created_at, updated_at`,
        [first_name, last_name]
      );

      reply.code(201);
      return { user: result.rows[0] };
    } catch (err) {
      reply.code(500);
      return {
        error: 'Failed to create user',
        message: err instanceof Error ? err.message : 'Unknown error',
      };
    }
  });

  // PUT /users/:id - Update a user
  fastify.put<{ Params: { id: string }; Body: UpdateUserBody }>(
    '/users/:id',
    async (request, reply) => {
      try {
        const { id } = request.params;
        const { first_name, last_name } = request.body;

        if (!first_name && !last_name) {
          reply.code(400);
          return { error: 'At least one field (first_name or last_name) must be provided' };
        }

        const updates: string[] = [];
        const values: string[] = [];
        let paramIndex = 1;

        if (first_name !== undefined) {
          updates.push(`first_name = $${paramIndex++}`);
          values.push(first_name);
        }
        if (last_name !== undefined) {
          updates.push(`last_name = $${paramIndex++}`);
          values.push(last_name);
        }

        values.push(id);
        const query = `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING id, first_name, last_name, created_at, updated_at`;

        const result = await fastify.pg.query<User>(query, values);

        if (result.rows.length === 0) {
          reply.code(404);
          return { error: 'User not found' };
        }

        return { user: result.rows[0] };
      } catch (err) {
        reply.code(500);
        return {
          error: 'Failed to update user',
          message: err instanceof Error ? err.message : 'Unknown error',
        };
      }
    }
  );

  // DELETE /users/:id - Delete a user
  fastify.delete<{ Params: { id: string } }>('/users/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const result = await fastify.pg.query(
        'DELETE FROM users WHERE id = $1 RETURNING id',
        [id]
      );

      if (result.rows.length === 0) {
        reply.code(404);
        return { error: 'User not found' };
      }

      reply.code(204);
      return {};
    } catch (err) {
      reply.code(500);
      return {
        error: 'Failed to delete user',
        message: err instanceof Error ? err.message : 'Unknown error',
      };
    }
  });
}

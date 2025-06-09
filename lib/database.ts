import { Pool } from 'pg';

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Database schema initialization
export async function initializeDatabase() {
  const client = await pool.connect();
  try {
    // Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Stores table
    await client.query(`
      CREATE TABLE IF NOT EXISTS stores (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        domain VARCHAR(255) UNIQUE,
        subdomain VARCHAR(255) UNIQUE,
        template_id VARCHAR(255),
        settings JSONB DEFAULT '{}',
        is_published BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Products table
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        store_id INTEGER REFERENCES stores(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        images JSONB DEFAULT '[]',
        sku VARCHAR(255),
        stock_quantity INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        metadata JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Orders table
    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        store_id INTEGER REFERENCES stores(id) ON DELETE CASCADE,
        customer_email VARCHAR(255) NOT NULL,
        customer_name VARCHAR(255),
        customer_address JSONB,
        total_amount DECIMAL(10,2) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        payment_method VARCHAR(50),
        payment_status VARCHAR(50) DEFAULT 'pending',
        items JSONB NOT NULL,
        metadata JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // API Keys table for integrations
    await client.query(`
      CREATE TABLE IF NOT EXISTS api_keys (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        service VARCHAR(100) NOT NULL,
        key_data JSONB NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Deployments table
    await client.query(`
      CREATE TABLE IF NOT EXISTS deployments (
        id SERIAL PRIMARY KEY,
        store_id INTEGER REFERENCES stores(id) ON DELETE CASCADE,
        deployment_url VARCHAR(500),
        deployment_id VARCHAR(255),
        status VARCHAR(50) DEFAULT 'pending',
        build_logs TEXT,
        deployed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Initialize default user and store if they don't exist
    try {
      // First ensure the user exists
      const userCheck = await client.query('SELECT id FROM users WHERE id = 1');
      if (userCheck.rows.length === 0) {
        await client.query(`
          INSERT INTO users (id, email, password_hash, name, role) 
          VALUES (1, 'demo@dstores.app', 'demo_hash', 'Demo User', 'admin')
        `);
        console.log('Created default user with ID 1');
      }

      // Then ensure the store exists
      const storeCheck = await client.query('SELECT id FROM stores WHERE id = 1');
      if (storeCheck.rows.length === 0) {
        await client.query(`
          INSERT INTO stores (id, user_id, name, subdomain, template_id, is_published) 
          VALUES (1, 1, 'Demo Store', 'demo-store', 'modern-dropshipping', true)
        `);
        console.log('Created default store with ID 1');
      }

      // Reset sequences to ensure proper ID assignment for future inserts
      await client.query('SELECT setval(pg_get_serial_sequence(\'users\', \'id\'), GREATEST(1, (SELECT COALESCE(MAX(id), 0) FROM users)))');
      await client.query('SELECT setval(pg_get_serial_sequence(\'stores\', \'id\'), GREATEST(1, (SELECT COALESCE(MAX(id), 0) FROM stores)))');

      // Add sample products if store exists but has no products
      const productCheck = await client.query('SELECT COUNT(*) as count FROM products WHERE store_id = 1');
      if (parseInt(productCheck.rows[0].count) === 0) {
        const sampleProducts = [
          {
            name: 'Premium Wireless Headphones',
            description: 'High-quality noise-canceling wireless headphones with 30-hour battery life.',
            price: 299.99,
            images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'],
            sku: 'WH-001',
            stock_quantity: 25,
            metadata: { status: 'active', category: 'Electronics' }
          },
          {
            name: 'Sustainable Cotton T-Shirt',
            description: 'Eco-friendly organic cotton t-shirt, soft and comfortable for everyday wear.',
            price: 39.99,
            images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500'],
            sku: 'TS-001',
            stock_quantity: 50,
            metadata: { status: 'active', category: 'Fashion' }
          },
          {
            name: 'Vitamin C Serum',
            description: 'Brightening vitamin C serum for radiant, youthful skin. Suitable for all skin types.',
            price: 89.99,
            images: ['https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=500'],
            sku: 'VS-001',
            stock_quantity: 30,
            metadata: { status: 'active', category: 'Skincare' }
          },
          {
            name: 'Ceramic Plant Pot',
            description: 'Modern minimalist ceramic plant pot, perfect for indoor plants and home decoration.',
            price: 24.99,
            images: ['https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500'],
            sku: 'PP-001',
            stock_quantity: 40,
            metadata: { status: 'active', category: 'Home Decor' }
          },
          {
            name: 'Smart Watch Series 5',
            description: 'Advanced fitness tracking smartwatch with heart rate monitor and GPS.',
            price: 399.99,
            images: ['https://images.unsplash.com/photo-1544117519-31a4b719223d?w=500'],
            sku: 'SW-001',
            stock_quantity: 20,
            metadata: { status: 'active', category: 'Electronics' }
          },
          {
            name: 'Leather Crossbody Bag',
            description: 'Handcrafted genuine leather crossbody bag with adjustable strap.',
            price: 159.99,
            images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500'],
            sku: 'LB-001',
            stock_quantity: 15,
            metadata: { status: 'active', category: 'Fashion' }
          },
          {
            name: 'Himalayan Salt Lamp',
            description: 'Natural Himalayan salt lamp for air purification and ambient lighting.',
            price: 49.99,
            images: ['https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=500'],
            sku: 'HL-001',
            stock_quantity: 35,
            metadata: { status: 'active', category: 'Home Decor' }
          },
          {
            name: 'Retinol Night Cream',
            description: 'Anti-aging retinol night cream for smoother, firmer skin overnight.',
            price: 129.99,
            images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500'],
            sku: 'RC-001',
            stock_quantity: 25,
            metadata: { status: 'active', category: 'Skincare' }
          },
          {
            name: 'Bluetooth Speaker',
            description: 'Portable waterproof Bluetooth speaker with 360-degree sound.',
            price: 79.99,
            images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500'],
            sku: 'BS-001',
            stock_quantity: 45,
            metadata: { status: 'active', category: 'Electronics' }
          },
          {
            name: 'Cashmere Scarf',
            description: 'Luxurious 100% cashmere scarf in multiple colors, perfect for any season.',
            price: 199.99,
            images: ['https://images.unsplash.com/photo-1547884693-7abf3b04305b?w=500'],
            sku: 'CS-001',
            stock_quantity: 18,
            metadata: { status: 'active', category: 'Fashion' }
          }
        ];

        for (const product of sampleProducts) {
          await client.query(`
            INSERT INTO products (store_id, name, description, price, images, sku, stock_quantity, metadata) 
            VALUES (1, $1, $2, $3, $4, $5, $6, $7)
          `, [
            product.name,
            product.description,
            product.price,
            JSON.stringify(product.images),
            product.sku,
            product.stock_quantity,
            JSON.stringify(product.metadata)
          ]);
        }
        console.log('Created sample products for demo store');
      }

    } catch (initError) {
      console.error('Error initializing default data:', initError);
      // Continue anyway - the main tables are created
    }

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  } finally {
    client.release();
  }
}

// User operations
export const userOperations = {
  async create(email: string, passwordHash: string, name: string) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING *',
        [email, passwordHash, name]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  },

  async findByEmail(email: string) {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
      return result.rows[0];
    } finally {
      client.release();
    }
  },

  async findById(id: number) {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM users WHERE id = $1', [id]);
      return result.rows[0];
    } finally {
      client.release();
    }
  }
};

// Store operations
export const storeOperations = {
  async create(userId: number, name: string, templateId?: string) {
    const client = await pool.connect();
    try {
      const subdomain = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const result = await client.query(
        'INSERT INTO stores (user_id, name, subdomain, template_id) VALUES ($1, $2, $3, $4) RETURNING *',
        [userId, name, subdomain, templateId]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  },

  async findByUserId(userId: number) {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM stores WHERE user_id = $1', [userId]);
      return result.rows;
    } finally {
      client.release();
    }
  },

  async findById(id: number) {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM stores WHERE id = $1', [id]);
      return result.rows[0];
    } finally {
      client.release();
    }
  },

  async update(id: number, updates: any) {
    const client = await pool.connect();
    try {
      const setClause = Object.keys(updates).map((key, index) => `${key} = $${index + 2}`).join(', ');
      const values = [id, ...Object.values(updates)];

      const result = await client.query(
        `UPDATE stores SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
        values
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }
};

// Product operations
export const productOperations = {
  async create(storeId: number, productData: any) {
    const client = await pool.connect();
    try {
      const { name, description, price, images, sku, stock_quantity, metadata } = productData;
      const result = await client.query(
        'INSERT INTO products (store_id, name, description, price, images, sku, stock_quantity, metadata) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
        [storeId, name, description, price, JSON.stringify(images || []), sku, stock_quantity || 0, JSON.stringify(metadata || {})]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  },

  async findByStoreId(storeId: number) {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM products WHERE store_id = $1 AND is_active = true', [storeId]);
      return result.rows;
    } finally {
      client.release();
    }
  },

  async findById(id: number) {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM products WHERE id = $1', [id]);
      return result.rows[0];
    } finally {
      client.release();
    }
  },

  async update(id: number, updates: any) {
    const client = await pool.connect();
    try {
      const setClause = Object.keys(updates).map((key, index) => `${key} = $${index + 2}`).join(', ');
      const values = [id, ...Object.values(updates)];

      const result = await client.query(
        `UPDATE products SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
        values
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  },

  async delete(id: number) {
    const client = await pool.connect();
    try {
      await client.query('UPDATE products SET is_active = false WHERE id = $1', [id]);
    } finally {
      client.release();
    }
  }
};

// Order operations
export const orderOperations = {
  async create(orderData: any) {
    const client = await pool.connect();
    try {
      const { store_id, customer_email, customer_name, customer_address, total_amount, items, payment_method, metadata } = orderData;
      const result = await client.query(
        'INSERT INTO orders (store_id, customer_email, customer_name, customer_address, total_amount, items, payment_method, metadata) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
        [store_id, customer_email, customer_name, JSON.stringify(customer_address), total_amount, JSON.stringify(items), payment_method, JSON.stringify(metadata || {})]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  },

  async findByStoreId(storeId: number) {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM orders WHERE store_id = $1 ORDER BY created_at DESC', [storeId]);
      return result.rows;
    } finally {
      client.release();
    }
  },

  async updateStatus(id: number, status: string, paymentStatus?: string) {
    const client = await pool.connect();
    try {
      const updates = paymentStatus
        ? 'status = $2, payment_status = $3, updated_at = CURRENT_TIMESTAMP'
        : 'status = $2, updated_at = CURRENT_TIMESTAMP';
      const values = paymentStatus ? [id, status, paymentStatus] : [id, status];

      const result = await client.query(
        `UPDATE orders SET ${updates} WHERE id = $1 RETURNING *`,
        values
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  },

  async findById(id: number) {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM orders WHERE id = $1', [id]);
      return result.rows[0];
    } finally {
      client.release();
    }
  }
};

// API Keys operations
export const apiKeyOperations = {
  async store(userId: number, service: string, keyData: any) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'INSERT INTO api_keys (user_id, service, key_data) VALUES ($1, $2, $3) ON CONFLICT (user_id, service) DO UPDATE SET key_data = $3, updated_at = CURRENT_TIMESTAMP RETURNING *',
        [userId, service, JSON.stringify(keyData)]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  },

  async get(userId: number, service: string) {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM api_keys WHERE user_id = $1 AND service = $2 AND is_active = true', [userId, service]);
      return result.rows[0];
    } finally {
      client.release();
    }
  }
};

// Deployment operations
export const deploymentOperations = {
  async create(storeId: number, deploymentData: any) {
    const client = await pool.connect();
    try {
      const { deployment_url, deployment_id, status, build_logs } = deploymentData;
      const result = await client.query(
        'INSERT INTO deployments (store_id, deployment_url, deployment_id, status, build_logs) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [storeId, deployment_url, deployment_id, status, build_logs]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  },

  async findByStoreId(storeId: number) {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM deployments WHERE store_id = $1 ORDER BY deployed_at DESC', [storeId]);
      return result.rows;
    } finally {
      client.release();
    }
  },

  async updateStatus(id: number, status: string, buildLogs?: string) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'UPDATE deployments SET status = $2, build_logs = COALESCE($3, build_logs) WHERE id = $1 RETURNING *',
        [id, status, buildLogs]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }
};

// Function to explicitly add sample products with images
export async function addSampleProducts(storeId: number = 1) {
  const client = await pool.connect();
  try {
    // First, clear existing products for this store
    await client.query('DELETE FROM products WHERE store_id = $1', [storeId]);

    const sampleProducts = [
      {
        name: 'Premium Wireless Headphones',
        description: 'High-quality noise-canceling wireless headphones with 30-hour battery life.',
        price: 299.99,
        images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'],
        sku: 'WH-001',
        stock_quantity: 25,
        metadata: { status: 'active', category: 'Electronics' }
      },
      {
        name: 'Sustainable Cotton T-Shirt',
        description: 'Eco-friendly organic cotton t-shirt, soft and comfortable for everyday wear.',
        price: 39.99,
        images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500'],
        sku: 'TS-001',
        stock_quantity: 50,
        metadata: { status: 'active', category: 'Fashion' }
      },
      {
        name: 'Vitamin C Serum',
        description: 'Brightening vitamin C serum for radiant, youthful skin. Suitable for all skin types.',
        price: 89.99,
        images: ['https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=500'],
        sku: 'VS-001',
        stock_quantity: 30,
        metadata: { status: 'active', category: 'Skincare' }
      },
      {
        name: 'Ceramic Plant Pot',
        description: 'Modern minimalist ceramic plant pot, perfect for indoor plants and home decoration.',
        price: 24.99,
        images: ['https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500'],
        sku: 'PP-001',
        stock_quantity: 40,
        metadata: { status: 'active', category: 'Home Decor' }
      },
      {
        name: 'Smart Watch Series 5',
        description: 'Advanced fitness tracking smartwatch with heart rate monitor and GPS.',
        price: 399.99,
        images: ['https://images.unsplash.com/photo-1544117519-31a4b719223d?w=500'],
        sku: 'SW-001',
        stock_quantity: 20,
        metadata: { status: 'active', category: 'Electronics' }
      },
      {
        name: 'Leather Crossbody Bag',
        description: 'Handcrafted genuine leather crossbody bag with adjustable strap.',
        price: 159.99,
        images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500'],
        sku: 'LB-001',
        stock_quantity: 15,
        metadata: { status: 'active', category: 'Fashion' }
      },
      {
        name: 'Himalayan Salt Lamp',
        description: 'Natural Himalayan salt lamp for air purification and ambient lighting.',
        price: 49.99,
        images: ['https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=500'],
        sku: 'HL-001',
        stock_quantity: 35,
        metadata: { status: 'active', category: 'Home Decor' }
      },
      {
        name: 'Retinol Night Cream',
        description: 'Anti-aging retinol night cream for smoother, firmer skin overnight.',
        price: 129.99,
        images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500'],
        sku: 'RC-001',
        stock_quantity: 25,
        metadata: { status: 'active', category: 'Skincare' }
      },
      {
        name: 'Bluetooth Speaker',
        description: 'Portable waterproof Bluetooth speaker with 360-degree sound.',
        price: 79.99,
        images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500'],
        sku: 'BS-001',
        stock_quantity: 45,
        metadata: { status: 'active', category: 'Electronics' }
      },
      {
        name: 'Cashmere Scarf',
        description: 'Luxurious 100% cashmere scarf in multiple colors, perfect for any season.',
        price: 199.99,
        images: ['https://images.unsplash.com/photo-1547884693-7abf3b04305b?w=500'],
        sku: 'CS-001',
        stock_quantity: 18,
        metadata: { status: 'active', category: 'Fashion' }
      }
    ];

    for (const product of sampleProducts) {
      await client.query(`
        INSERT INTO products (store_id, name, description, price, images, sku, stock_quantity, metadata) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [
        storeId,
        product.name,
        product.description,
        product.price,
        JSON.stringify(product.images),
        product.sku,
        product.stock_quantity,
        JSON.stringify(product.metadata)
      ]);
    }

    console.log(`Added ${sampleProducts.length} sample products with images for store ${storeId}`);
    return sampleProducts.length;
  } catch (error) {
    console.error('Error adding sample products:', error);
    throw error;
  } finally {
    client.release();
  }
}

export default pool; 
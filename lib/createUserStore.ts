import fs from 'fs-extra';
import path from 'path';

export async function createUserStore(username: string, products: any[], templatePath = 'templates/default') {
  const userStorePath = path.resolve(process.cwd(), 'stores', username);
  const baseTemplatePath = path.resolve(process.cwd(), templatePath);

  // Copy template to user store path
  await fs.copy(baseTemplatePath, userStorePath);

  // Inject product list into static JSON
  const productDataPath = path.join(userStorePath, 'data', 'products.json');
  await fs.ensureDir(path.dirname(productDataPath));
  await fs.writeJson(productDataPath, products, { spaces: 2 });

  return userStorePath;
}

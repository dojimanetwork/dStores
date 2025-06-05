# Contributing to Web3 Stores

We love your input! We want to make contributing to Web3 Stores as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

## Pull Requests

Pull requests are the best way to propose changes to the codebase. We actively welcome your pull requests:

1. Fork the repo and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

## Setting Up Development Environment

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/yourusername/web3-stores.git
   cd web3-stores
   ```

2. **Run the installation script**
   ```bash
   chmod +x install.sh
   ./install.sh
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Make your changes and test**

## Adding New Templates

To add a new template:

1. **Create the template function** in `components/DynamicTemplate.tsx`:
   ```typescript
   function YourNewTemplate(props: any) {
     const { data, cart, onAddToCart, onProductClick, onNavigate, currentPage, cartItemCount } = props;
     // Your template code here
     return <div>Your template JSX</div>;
   }
   ```

2. **Add template configuration** in `components/templatesData.ts`:
   ```typescript
   {
     id: 'your-template-id',
     name: 'Your Template Name',
     description: 'Template description',
     category: 'Category',
     image: '/template-preview.jpg',
     colors: ['#color1', '#color2'],
     features: ['Feature 1', 'Feature 2']
   }
   ```

3. **Add the template case** in the DynamicTemplate switch statement:
   ```typescript
   case 'your-template-id':
     return <YourNewTemplate {...templateProps} />;
   ```

4. **Create template page** at `pages/dashboard/templates/your-template-id.tsx`:
   ```typescript
   import DynamicTemplate from '../../../components/DynamicTemplate';
   
   export default function YourTemplatePage() {
     return <DynamicTemplate templateId="your-template-id" />;
   }
   ```

## Template Guidelines

### Design Principles
- **Mobile-first responsive design**
- **Accessibility compliance** (ARIA labels, keyboard navigation)
- **Performance optimization** (lazy loading, optimized images)
- **Clean, modern aesthetics**

### Required Features
Each template must include:
- ✅ Home page with hero section
- ✅ Product catalog with search/filtering
- ✅ Shopping cart functionality
- ✅ Responsive navigation
- ✅ Add to cart buttons
- ✅ Cart item count display

### Code Standards
- Use TypeScript for type safety
- Follow React hooks patterns
- Implement proper error handling
- Use Tailwind CSS for styling
- Ensure cross-browser compatibility

## Coding Style

### TypeScript/React
- Use functional components with hooks
- Implement proper TypeScript interfaces
- Use meaningful variable and function names
- Add JSDoc comments for complex functions

### CSS/Styling
- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Use semantic HTML elements
- Ensure adequate color contrast

### Example Code Style
```typescript
interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onProductClick: (product: Product) => void;
}

function ProductCard({ product, onAddToCart, onProductClick }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <img 
        src={product.image} 
        alt={product.name}
        className="w-full h-48 object-cover cursor-pointer"
        onClick={() => onProductClick(product)}
      />
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-4">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-blue-600">{product.formattedPrice}</span>
          <button 
            onClick={() => onAddToCart(product)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
```

## Bug Reports

We use GitHub issues to track public bugs. Report a bug by [opening a new issue](https://github.com/yourusername/web3-stores/issues/new).

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

## Feature Requests

We welcome feature requests! Please:

1. Check if the feature has already been requested
2. Provide a clear description of the feature
3. Explain the use case and why it would be valuable
4. Consider offering to implement it yourself

## Database Changes

If your changes require database schema modifications:

1. **Update the schema** in `lib/database.ts`
2. **Create migration script** in `scripts/` directory
3. **Update the initialization script** in `scripts/init-db.js`
4. **Test the migration** thoroughly
5. **Document the changes** in your PR

## Testing

Before submitting a PR:

1. **Test your changes** manually
2. **Check all templates** still work correctly
3. **Verify responsive design** on different screen sizes
4. **Test database operations** if applicable
5. **Ensure no console errors**

## Commit Messages

Use clear and meaningful commit messages:

```
feat: add new minimal template with dark mode support
fix: resolve cart quantity update bug in mobile view
docs: update installation instructions for Windows
style: improve button hover effects across templates
refactor: optimize product loading performance
```

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

## Questions?

Feel free to open an issue or reach out to the maintainers if you have any questions about contributing!

---

Thank you for contributing to Web3 Stores! 🚀 
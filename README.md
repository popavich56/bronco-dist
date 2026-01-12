<p align="center">
  <img src="./public/xclade/logo.svg" alt="xClade logo" width="200" height="auto">
</p>

<h1 align="center">
  xClade Business Portal
</h1>

<p align="center">
A modern, open-source B2B distribution platform built with Next.js 15, featuring enterprise-grade commerce capabilities and streamlined procurement workflows.</p>

<p align="center">
  <a href="https://github.com/xclade/businessx/blob/main/CONTRIBUTING.md">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat" alt="PRs welcome!" />
  </a>
  <a href="https://github.com/xclade/businessx/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT" />
  </a>
  <a href="https://github.com/xclade/businessx/stargazers">
    <img src="https://img.shields.io/github/stars/xclade/businessx.svg?style=flat" alt="Stars" />
  </a>
  <a href="https://github.com/xclade/businessx/network/members">
    <img src="https://img.shields.io/github/forks/xclade/businessx.svg?style=flat" alt="Forks" />
  </a>
</p>

## 🚀 Features

A comprehensive B2B distribution platform with enterprise-grade features:

### Commerce Capabilities
- **Product Management**: Detailed product pages, collections, and bulk ordering
- **B2B Account System**: Company accounts, employee management, and role-based access
- **Advanced Cart**: Bulk operations, quantity management, and quote requests
- **Secure Checkout**: Stripe integration with enterprise payment processing
- **Order Management**: Complete order lifecycle with transfer requests and tracking

### Technical Excellence
- **Next.js 15**: App Router, Server Components, and modern React patterns
- **TypeScript**: Full type safety and enhanced developer experience
- **Tailwind CSS**: Utility-first styling with custom design system
- **GraphQL**: Efficient data fetching with custom xClade GraphQL client
- **Performance**: Server-side rendering, streaming, and optimized caching

### B2B-Specific Features
- **Bulk Ordering**: Streamlined procurement workflows
- **Quote System**: Request and manage product quotes
- **Company Portal**: Multi-user account management
- **Transfer Requests**: Order transfer and fulfillment workflows
- **Business Analytics**: Order history and spending insights

## 🛠️ Quick Start

### Prerequisites

- Node.js 18+ and Yarn
- Backend API (configured for your xClade environment)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/xclade/businessx.git
cd businessx
```

2. **Install dependencies**
```bash
yarn install
```

3. **Environment Setup**
```bash
cp .env.template .env.local
# Edit .env.local with your configuration
```

4. **Start Development Server**
```bash
yarn dev
```

5. **Open your browser**

Visit [http://localhost:8000](http://localhost:8000) to see your B2B portal!

### Build for Production

```bash
yarn build
yarn start
```

## 💳 Payment Integration

The platform supports enterprise payment processing with:

- **Stripe**: Secure payment processing for B2B transactions
- **Multi-currency**: Support for international business operations

### Configuration

Add to your `.env.local`:

```bash
NEXT_PUBLIC_STRIPE_KEY=pk_test_your_stripe_publishable_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
```

## 📚 Resources & Documentation

### xClade Ecosystem
- [xClade Organization](https://github.com/xclade)
- [GraphQL Client](https://github.com/xclade/graphql-client)
- [Type Definitions](https://github.com/xclade/types)

### Technology Stack
- [Next.js Documentation](https://nextjs.org/docs)
- [React 19](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Stripe Payments](https://stripe.com/docs)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup
```bash
# Fork and clone
git clone https://github.com/your-username/businessx.git

# Create feature branch
git checkout -b feature/amazing-feature

# Make changes and test
yarn lint
yarn build

# Submit pull request
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

Built with modern web technologies and designed for enterprise B2B workflows.

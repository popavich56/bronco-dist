# Contributing to xClade Business Portal

Thank you for your interest in contributing to the xClade Business Portal! This document provides guidelines and information for contributors.

## Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/businessx.git
   cd businessx
   ```

2. **Install Dependencies**
   ```bash
   yarn install
   ```

3. **Environment Setup**
   ```bash
   cp .env.template .env.local
   # Configure your environment variables
   ```

4. **Start Development**
   ```bash
   yarn dev
   ```

## Code Style

- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write meaningful commit messages
- Add tests for new features

## Pull Request Process

1. Create a feature branch from `main`
2. Make your changes and ensure tests pass
3. Run `yarn lint` and `yarn build` to verify
4. Submit a pull request with a clear description
5. Wait for review and address any feedback

## Reporting Issues

- Use GitHub Issues to report bugs
- Provide detailed steps to reproduce
- Include browser/OS information
- Add screenshots if relevant

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
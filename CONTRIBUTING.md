# Contributing to HAAAI Social Scribe

Thank you for your interest in contributing to HAAAI Social Scribe! This document provides guidelines for contributing to the project.

## 🚀 Getting Started

1. Fork the repository
2. Clone your fork locally
3. Set up the development environment (see README.md)
4. Create a new branch for your feature/fix

## 🔧 Development Setup

### Backend Development
```bash
cd backend
pip install -r requirements.txt
cp api_key.example.json api_key.json
# Edit api_key.json with your API keys
python app.py
```

### Frontend Development
```bash
cd frontend
npm install
npm run dev
```

## 📝 Code Style

### Python (Backend)
- Follow PEP 8 style guidelines
- Use meaningful variable and function names
- Add docstrings to functions and classes
- Keep functions focused and small

### JavaScript/TypeScript (Frontend)
- Use consistent indentation (2 spaces)
- Follow ESLint configuration
- Use meaningful component and variable names
- Write self-documenting code

## 🧪 Testing

- Test your changes thoroughly before submitting
- Ensure both backend and frontend work together
- Test with different AI models if possible
- Verify API endpoints work correctly

## 🔒 Security Guidelines

- Never commit API keys or sensitive data
- Use environment variables for configuration
- Review code for potential security vulnerabilities
- Follow the principle of least privilege

## 📋 Pull Request Process

1. Update documentation if needed
2. Add tests for new functionality
3. Ensure all tests pass
4. Update the README.md if necessary
5. Submit a pull request with a clear description

## 🐛 Bug Reports

When reporting bugs, please include:
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Environment details (OS, Python/Node versions)
- Error messages or logs

## 💡 Feature Requests

For feature requests, please:
- Describe the feature clearly
- Explain the use case
- Consider the impact on existing functionality
- Discuss implementation approaches

## 📞 Getting Help

- Check existing issues and documentation
- Ask questions in GitHub issues
- Be respectful and constructive in discussions

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License. 
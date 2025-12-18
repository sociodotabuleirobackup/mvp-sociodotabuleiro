# Security Guidelines

## Environment Variables Security

### ⚠️ CRITICAL SECURITY RULES

1. **NEVER commit `.env` files to version control**
2. **NEVER include real secrets in documentation**
3. **ALWAYS use `.env.example` as template with placeholder values**
4. **ROTATE secrets regularly in production**

### Protected Files

The following files are automatically ignored by git and should NEVER be committed:

```bash
# Environment files
.env
.env.*
apps/*/.env
apps/*/.env.*
packages/*/.env
packages/*/.env.*

# Documentation with sensitive information
**/SECRETS.md
**/PASSWORDS.md
**/KEYS.md
**/CREDENTIALS.md
**/CONFIG.md
**/*_PRIVATE.md
**/*_SECRET.md
**/*_INTERNAL.md
```

### Safe Practices

#### ✅ DO
- Use strong, unique passwords and API keys
- Use environment-specific values (dev/staging/prod)
- Store production secrets in secure secret management services
- Document variable purposes in `.env.example`
- Use placeholder values like `your-api-key-here`

#### ❌ DON'T
- Commit real API keys, passwords, or tokens
- Share `.env` files via email, Slack, or other channels
- Use production secrets in development
- Include secrets in documentation files
- Use weak or default passwords in production

### Secret Management Services

For production environments, consider using:

- **AWS Secrets Manager**
- **HashiCorp Vault**
- **Azure Key Vault**
- **Google Secret Manager**
- **Railway/Render built-in secrets**

### Emergency Response

If secrets are accidentally committed:

1. **Immediately rotate all exposed secrets**
2. **Remove from git history** using `git filter-branch` or BFG Repo-Cleaner
3. **Audit access logs** for unauthorized usage
4. **Update all environments** with new secrets
5. **Review and improve security practices**

### Reporting Security Issues

If you discover a security vulnerability, please:

1. **DO NOT** create a public issue
2. Email security concerns to the team lead
3. Include detailed information about the vulnerability
4. Allow time for assessment and remediation

## Code Security

### Dependencies

- Regularly update dependencies to patch security vulnerabilities
- Use `pnpm audit` to check for known vulnerabilities
- Review dependency licenses and sources

### API Security

- Always validate and sanitize input data
- Use rate limiting to prevent abuse
- Implement proper authentication and authorization
- Log security events for monitoring

### Database Security

- Use parameterized queries to prevent SQL injection
- Implement proper access controls
- Encrypt sensitive data at rest
- Regular security audits and backups
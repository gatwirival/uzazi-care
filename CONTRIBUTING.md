# Contributing to Afya Women Health Companion

Thank you for contributing.

## Contribution Process

1. Fork the repository and create a feature branch.
2. Keep changes focused on one feature or fix.
3. Follow existing TypeScript and UI patterns.
4. Run quality checks before opening a PR:

```bash
npm run lint
npm run build
```

5. Open a pull request with:
   - Clear summary of changes
   - Screenshots for UI updates
   - Testing notes

## Coding Guidelines

- Use strict TypeScript-safe patterns.
- Keep components simple and accessible.
- Reuse logic from `src/lib/health-advisor.ts` for health guidance rules.
- Do not include secrets in commits.

## Medical Safety Guidelines

- Keep language educational and non-diagnostic.
- Always preserve emergency escalation behavior.
- Do not remove safety disclaimers from UI or API responses.

## Suggested Branch Naming

- `feature/<short-name>`
- `fix/<short-name>`
- `docs/<short-name>`

## Commit Message Style

Use clear imperative style, for example:

- `feat: add postpartum mood guidance section`
- `fix: improve emergency symptom detection`
- `docs: update contribution workflow`

**Rules for the frontend programming**

- All prompts that I write must be written to @prompts/prompts-xvm.md Create the folder/file if not exists.
- Be concise, in case of doubt ask questions rather than inventing

**When working on the frontend**

- Clear Code Organization. Follow the conventions of this project
- If need new assets, try to download from shacdn/ui
- Don't add extra features not demanded
- Modularity: Small components with single responsibility, testable and composable. Try to keep components under ~150 lines. If bigger or handles more than one concept, split it.
- TypeScript by default
- Custom hooks for reusable logic, compound components for composable APIs, render props for specific use cases, and the provider pattern for shared state. Avoid over-engineering: YAGNI comes first.


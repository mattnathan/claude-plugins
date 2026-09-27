# claude-plugins

This is a public Claude Code marketplace (`mattnathan`), and anyone can install from it. Never commit personal values such as the owner, domain or credentials; those belong in each user's `~/.config/workers-projects/config.env`.

- `plugins/workers-projects/` contains the `new-project`, `migrate-project` and `screenshot` skills. `new-project/template/` and its facts define the target setup for `new-project` and `migrate-project`.
- Test changes before pushing by running `claude --plugin-dir plugins/workers-projects` from a scratch project directory.
- Installed copies only update when the `version` in `plugins/workers-projects/.claude-plugin/plugin.json` changes, so bump it for every change you want users to get.
- Run `claude plugin validate .` and `claude plugin validate plugins/workers-projects` before pushing.

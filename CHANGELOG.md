# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- `useMilSymbol` (and therefore `<MilSymbol />`) now emits a `console.warn` when the
  supplied SIDC fails milsymbol's `isValid()` check. Previously an invalid SIDC rendered
  an empty placeholder with no diagnostic, so a typo looked like a missing marker. The
  warning is deduplicated per SIDC and does not throw — rendering behaviour is unchanged.
- `LICENSE` file (MIT). The license was already declared in `package.json` but the file
  itself was missing.
- This changelog.
- A "Getting a SIDC" section in the README with copy-paste symbol codes and a link to an
  interactive SIDC builder.

### Fixed

- README's `useMilSymbol` example called `symbol.toSVG()`, which does not exist. The
  correct method is `asSVG()`.
- Package description and assorted documentation described the library as React Leaflet
  **v4** only. Both v4 and v5 have been supported since 0.3.0 and are covered by CI.

## [0.3.0] - 2026-08-05

### Changed

- **BREAKING**: the `size` prop now takes precedence over `options.size`. If both were
  passed, the symbol previously rendered at `options.size` and now renders at `size`.
  Passing only one of them is unaffected.

### Removed

- Dead `useEffect`/`setIcon` block in `MilSymbol`. react-leaflet's own `updateMarker`
  already calls `setIcon` when the icon prop identity changes.

### Fixed

- `SymbolOptions` is now derived from milsymbol itself rather than hand-copied, so it
  tracks upstream automatically.
- Stale README guidance around React 19 and `--legacy-peer-deps`.

## [0.2.3] - 2026-04-03

### Added

- Unified release workflow, CodeQL security analysis, and Codecov coverage reporting.

### Fixed

- npm publish authentication via trusted publishers with OIDC provenance.

## [0.2.0] - 2026-02-12

### Added

- Support for numeric APP-6D SIDCs alongside letter-based APP-6B/C codes.
- `children` prop on `MilSymbol` for arbitrary react-leaflet children.
- Test suite, CI workflow, and a GitHub Pages demo app.

### Fixed

- Symbol rendering and memoization.

## [0.1.2] - 2025-03-11

### Added

- Initial release: `MilSymbol` component and `useMilSymbol` hook.

[Unreleased]: https://github.com/jacorbello/react-leaflet-milsymbol/compare/v0.3.0...HEAD
[0.3.0]: https://github.com/jacorbello/react-leaflet-milsymbol/compare/v0.2.3...v0.3.0
[0.2.3]: https://github.com/jacorbello/react-leaflet-milsymbol/compare/v0.2.0...v0.2.3
[0.2.0]: https://github.com/jacorbello/react-leaflet-milsymbol/compare/v0.1.2...v0.2.0
[0.1.2]: https://github.com/jacorbello/react-leaflet-milsymbol/releases/tag/v0.1.2

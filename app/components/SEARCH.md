# Search Functionality Documentation

## Overview

The search functionality allows users to search for articles by title, description, and optionally by content. The search is implemented as a modal dialog with shadcn-style UI components. Users can toggle between searching only metadata (titles, descriptions) or including the full article content in their search.

## Key Components

### 1. SearchCommand Component

Located at: `app/components/SearchCommand.tsx`

- Acts as a trigger for the search dialog
- Includes Ctrl+K/Cmd+K keyboard shortcut support
- Renders the search button in the navigation bar

### 2. SearchDialog Component

Located at: `app/components/SearchDialog.tsx`

- Main search interface with the following features:
  - Real-time search with debouncing (300ms)
  - Toggle for including article content in search
  - Keyboard navigation (arrow up/down, enter to select)
  - Highlighted search matches in results
  - Content snippet display for content matches

### 3. Search Service

Located at: `app/services/searchService.ts`

- Backend functions for fetching and searching articles
- Implements caching for improved performance
- Handles both metadata and content searches

## How Search Works

1. When a user opens the search dialog (by clicking the search icon or pressing Ctrl+K/Cmd+K), the SearchDialog component is displayed.

2. As the user types in the search box, the input is debounced for 300ms to avoid too many search requests.

3. The search service fetches the article index and then, depending on the search parameters:
   - Searches article titles and descriptions
   - Optionally fetches and searches the full markdown content of articles

4. Results are displayed with highlighted matches, and users can navigate through results using keyboard arrows and select with Enter key.

5. When a user selects an article, they are navigated to that article's page and the search dialog closes.

## Feature: Content Search Toggle

The content search toggle allows users to choose between:

- Fast, metadata-only search (default)
- Comprehensive content search that includes the full article text

When content search is enabled, the service will:
1. Fetch the article markdown files 
2. Search within their content
3. Display context snippets showing matches within the article content

## Implementation Notes

- Metadata and content are cached to improve performance and reduce API calls.
- Search results highlight the matching text for better visibility.
- The search UI is responsive and works on both desktop and mobile devices.
- The search component uses the ShadCN UI Dialog component, not the Command component.

## Future Enhancements

Possible improvements for the search functionality:

1. **Full-text indexing**: Implement a proper indexing system for faster content search.
2. **Search filters**: Add filters for date ranges, authors, or categories.
3. **Fuzzy matching**: Implement fuzzy search to handle typos and close matches.
4. **Search history**: Remember recent searches for quick access.
5. **Local storage caching**: Store article content in local storage to reduce API calls.
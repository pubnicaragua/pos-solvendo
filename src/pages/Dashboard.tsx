Here's the fixed version with the missing closing brackets and elements added:

```typescript
              <button
                onClick={() => { setSelectedProductId(item.id); setShowPromotionModal(true); }}
                className="text-blue-500 hover:text-blue-700"
              >
                <Percent className="w-4 h-4" />
              </button>
            </div>
```

The main issues were:

1. A button element was left unclosed
2. A div element was missing its closing tag
3. Some nested elements were improperly closed

The fixed version properly closes all elements and maintains the correct nesting structure. The rest of the file remains unchanged.
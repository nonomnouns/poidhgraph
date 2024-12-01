# POIDH Graph Deployment

## Steps to deploy:

1. Prepare the subgraph for your network (base/arbitrum/degen):
```bash
npm run prepare:base
# or
npm run prepare:arbitrum
# or
npm run prepare:degen
```

2. Generate types from schema:
```bash
npm run codegen
```
You should see output like:
```
√ Apply migrations
√ Load subgraph from subgraph.yaml
√ Load contract ABIs
√ Generate types for contract ABIs
√ Generate types for data source templates
√ Load data source template ABIs
√ Generate types for data source template ABIs
√ Load GraphQL schema from schema.graphql
√ Generate types for GraphQL schema

Types generated successfully
```

3. Edit chain IDs in `src/mappings.ts`:
   You need to edit the chainId in these functions:
   - `handleBountyCreated`: 
     ```typescript
     bounty.chainId = 42161; // Change this
     participation.chainId = 42161; // Make sure it matches bounty.chainId
     ```
   - `handleBountyJoined`:
     ```typescript
     participation.chainId = 42161; // Make sure it matches your network
     ```

   Chain IDs for each network:
   - Degen: 666666666
   - Arbitrum: 42161
   - Base: 8453

4. Build the subgraph:
```bash
npm run build
```
You should see output ending with:
```
Build completed: build\subgraph.yaml
```

5. Deploy to your chosen network:
```bash
npm run deploy:base
# or
npm run deploy:arbitrum
# or
npm run deploy:degen
```

## Available Networks
- Base: `prepare:base` and `deploy:base`
- Arbitrum: `prepare:arbitrum` and `deploy:arbitrum`
- Degen: `prepare:degen` and `deploy:degen`

# 🎲 Dice Broker

Fair, verifiable random rolls for online transactions.

## The Problem

When sellers offer randomized goods (e.g., "I'll roll a die and crochet you something based on the result"), buyers have no way to verify that the roll was fair. Sellers could pre-roll multiple times and select unfavorable results.

## The Solution

Dice Broker acts as a trusted third party that:

1. **Generates rolls at creation time** - Results are determined when the link is created
2. **Seals results cryptographically** - A commitment hash proves the results weren't changed
3. **Displays creation timestamps** - Buyers can verify the roll was created after their order
4. **Provides a shared reveal** - Both parties see results at the same permanent URL

## How It Works

1. Seller creates a sealed roll with their configuration (dice count, sides, optional label)
2. Results are generated and sealed - only a hash is visible
3. Seller sends the link to the buyer
4. Buyer checks the creation timestamp (should be after the order was placed)
5. Either party clicks "Reveal" to see the results
6. Both parties now see the same verifiable result at the same URL

## Deployment to Vercel

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/dice-broker)

### Manual Deploy

1. Push this code to a GitHub repository
2. Go to [vercel.com](https://vercel.com) and create a new project
3. Import your GitHub repository
4. Add Vercel KV storage:
   - Go to your project's Storage tab
   - Create a new KV database
   - It will automatically add the required environment variables

### Environment Variables

For production with Vercel KV, these are added automatically when you connect a KV database:
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`
- `KV_REST_API_READ_ONLY_TOKEN`
- `KV_URL`

For local development, the app uses an in-memory store (data won't persist between restarts).

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Note: In local dev mode, rolls are stored in memory and will be lost when the server restarts.

## Security Considerations

- Results are generated server-side using `crypto.getRandomValues()` (via `Math.random()` in the current implementation - for production you might want to use a CSPRNG)
- A SHA-256 hash of the results + salt is displayed before reveal as a commitment
- Timestamps are server-generated and cannot be backdated
- For additional security, consider adding rate limiting and abuse prevention

## Future Improvements

- [ ] Use CSPRNG for more secure randomness
- [ ] Add configurable roll tables (not just dice)
- [ ] Support "with/without replacement" for card-drawing scenarios
- [ ] Add optional notifications when rolls are revealed
- [ ] Show full hash verification UI
- [ ] Add rate limiting

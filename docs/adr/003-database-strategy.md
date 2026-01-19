# ADR 003: Database Strategy

**Status**: Accepted
**Date**: 2024-01-19
**Decision Makers**: Development Team

## Context

ScaleSite needed a database solution that balances:
- Development speed
- Production readiness
- Scalability
- Ease of deployment
- Cost efficiency

## Decision

We selected **SQLite with better-sqlite3** as the primary database, with **Neon PostgreSQL** as a cloud migration option.

### Current Implementation

#### SQLite (Primary)
- **Library**: better-sqlite3
- **Location**: Local file storage
- **Features**: WAL mode, foreign keys, ACID compliance

```javascript
const db = new Database('database.db');
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');
```

#### Database Schema
- Users (authentication, profiles)
- Projects (client projects)
- Tickets (support tickets)
- Messages (ticket messages)
- Campaigns (newsletter)
- Subscribers (email list)
- Invoices (billing)
- Transactions (payments)

### Future Migration Path

#### Neon PostgreSQL (Cloud Option)
- **When to migrate**: Multi-tenant SaaS scaling
- **Benefits**: Horizontal scaling, better concurrency
- **Compatibility**: Most SQL queries remain the same
- **Migration strategy**: Gradual migration per table

## Rationale

### Why SQLite?

#### Advantages
1. **Zero Configuration**: No separate database server
2. **Fast Performance**: In-process, no network overhead
3. **Reliability**: ACID compliant, battle-tested
4. **Portability**: Single file backup/restore
5. **Cost**: Free, no infrastructure costs
6. **Development Speed**: Instant setup, no Docker/containers

#### Performance Characteristics
- Excellent for read-heavy workloads
- Good write performance (WAL mode)
- Handles up to 100K writes/second
- Sufficient for single-tenant applications

#### Use Cases
- MVP and early-stage startups
- Single-tenant applications
- Embedded systems
- Mobile/desktop apps
- Prototyping and development

### Why Neon PostgreSQL?

#### Advantages
1. **Serverless**: Auto-scaling, pay-per-use
2. **Compatible**: Drop-in PostgreSQL replacement
3. **Modern**: Branching, bottomless storage
4. **Scalability**: Horizontal scaling, connection pooling
5. **Ecosystem**: Rich PostgreSQL extensions

#### Migration Benefits
- Multi-tenancy support
- Better concurrency for high write loads
- Advanced features (JSON, arrays, full-text search)
- Replication and high availability

#### Migration Strategy
1. **Phase 1**: Dual-write to both databases
2. **Phase 2**: Read from Neon, write to both
3. **Phase 3**: Full cutover to Neon
4. **Phase 4**: Deprecate SQLite

### Abstraction Layer

To enable easy migration, we abstract database operations:

```typescript
interface IDataService<T> {
  getById(id: string): Promise<T | null>;
  getAll(options?: QueryOptions): Promise<T[]>;
  create(data: Partial<T>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T>;
  delete(id: string): Promise<boolean>;
}
```

**Benefits**:
- Implementation-agnostic business logic
- Easy to swap databases
- Testable with mock implementations

## Consequences

### Positive
- **Fast Development**: No database setup needed
- **Low Cost**: No infrastructure costs initially
- **Easy Backup**: Single file copy
- **Reliable**: Battle-tested technology
- **Migration Path**: Clear upgrade to PostgreSQL

### Negative
- **Single-Server**: Can't scale horizontally
- **Concurrency**: Limited write concurrency
- **Network Access**: No remote access (without additional setup)

### Risks
- **Growth**: May need to migrate if successful
- **Locking**: Write locking under high concurrency
- **Features**: Limited advanced database features

### Mitigation
- Monitor performance metrics
- Design schema for easy migration
- Use abstraction layer
- Plan migration before hitting limits

## Performance Considerations

### Current Load
- < 1000 users
- < 10K requests/day
- < 100 concurrent connections

### SQLite Limits
- Theoretical: 140 TB max database size
- Practical: 10-100 GB for good performance
- Writes: 100K/second (sequential)

### Migration Triggers
Consider migrating to Neon when:
- Concurrent writes > 100/second
- Database size > 10 GB
- Need for multi-tenancy
- Need for horizontal scaling
- High availability requirements

## Alternatives Considered

1. **PostgreSQL (Self-hosted)**: Rejected due to complexity
2. **MySQL**: Rejected (PostgreSQL preferred)
3. **MongoDB**: Rejected (need relational features)
4. **DynamoDB**: Rejected (cost, learning curve)
5. **Supabase**: Rejected (overkill for MVP)

## Related Decisions
- [ADR 001: Technology Stack](./001-technology-stack.md)
- [ADR 002: Architecture Patterns](./002-architecture-patterns.md)

## References
- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [better-sqlite3 Documentation](https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md)
- [Neon Documentation](https://neon.tech/docs)
- [SQLite vs PostgreSQL](https://www.postgresql.org/about/news/the-postgresql-development-group-is-pleased-to-announce-the-release-of-postgresql-16-2681/)

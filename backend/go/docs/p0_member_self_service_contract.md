# P0 Member Self-Service API Contract

Updated: 2026-04-26

## Scope
This contract defines the P0 endpoints for MEMBER self-service:
- profile read/update
- package list
- package register
- package renew

All endpoints below require:
- Authorization: Bearer <access_token>
- role: MEMBER

## Endpoints

### 1) GET /members/me
Return current member profile resolved from JWT account_id.

Success 200:
- Returns member detail (or basic member object if detail join is unavailable).

Errors:
- 401 unauthorized
- 404 member not found

### 2) PUT /members/me
Update current member profile (partial update supported).

Request body:
{
  "full_name": "string (optional)",
  "phone": "string (optional)",
  "email": "string (optional)",
  "gender": "string (optional)",
  "dob": "YYYY-MM-DD (optional)",
  "address": "string (optional)"
}

Success 200:
- Returns updated member entity.

Errors:
- 400 invalid body or invalid dob format
- 401 unauthorized
- 500 internal error

### 3) GET /members/me/packages
Return package subscriptions for current member.

Success 200:
[
  {
    "id": 123,
    "packageId": 2,
    "name": "Premium 6 months",
    "price": 1800000,
    "durationDays": 180,
    "status": "active",
    "registeredDate": "2026-04-01T08:00:00Z",
    "startDate": "2026-04-01T00:00:00Z",
    "endDate": "2026-10-01T00:00:00Z"
  }
]

Errors:
- 401 unauthorized
- 500 internal error

### 4) POST /members/me/packages/register
Register a new package for current member.

Request body:
{
  "package_id": 2
}

Success 201:
- Returns one MyPackageResponse object.

Errors:
- 400 invalid package_id or inactive package
- 401 unauthorized
- 404 package not found
- 409 member already has active package (use renew)
- 500 internal error

### 5) POST /members/me/packages/renew
Renew an existing package subscription for current member.

Request body:
{
  "subscription_id": 123,   // optional, latest subscription is used if omitted
  "renewal_months": 3
}

Success 200:
{
  "subscription_id": 123,
  "package_id": 2,
  "package_name": "Premium 6 months",
  "renewal_months": 3,
  "old_end_date": "2026-10-01T00:00:00Z",
  "new_end_date": "2027-01-01T00:00:00Z",
  "status": "active"
}

Errors:
- 400 invalid body or renewal_months <= 0
- 401 unauthorized
- 403 forbidden (subscription does not belong to current member)
- 404 subscription not found
- 500 internal error

## Ownership rules (P0)
- MEMBER can only access self-service endpoints under /members/me*.
- MEMBER access to GET /members/{id} is restricted to own member record only.
- OWNER/MANAGER/PT keep existing admin/staff behavior.

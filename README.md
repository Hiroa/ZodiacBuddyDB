# ZodiacBuddyDB

ZodiacBuddyDB is an app to communicate with the [ZodiacBuddy](https://github.com/daemitus/ZodiacBuddy) FFXIV plugin

## Api

[Swagger Docs](https://zodiac-buddy-db.fly.dev/api-docs/)

### Endpoints

#### GET /reports/last/{{datacenter_id}}

Gets the last report since last duty switch for the specified datacenter.

#### POST /reports

Take a report on body and save it.  
**This endpoint requires an authentication**

### Schema

#### Report

```json
{
  "datacenter_id": 6,
  "world_id": 39,
  "territory_id": 172,
  "date": "2022-06-24T01:19:53Z"
}
```

### Authentication

#### [JWT](https://jwt.io/)

Using HS512 for signature with the payload: 
```json
{
  "sub": "UserIdentifier",
  "iss": "ZodiacBuddyDB",
  "aud": "YourAppName",
  "iat": 1516239022
}
```
`iss` claim should always be `ZodiacBuddyDB`.  
`sub` claim is used to identify your user and `aud` your service.  
`iat` claim should not be more than one minute.  
The JWT can be sent in header `authorisation` or `x-access-token` as bearer token or directly 

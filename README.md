# Notify Utilities

This module contains common functionality used throughout the Notify App.

# Functions
## getCookieValue(cookieString, name) => Promise(tokenValue)

Argument     | Type     | Description
------------ | -------- |------------
cookieString | `String` | String containing all cookies.
name         | `String` | The name of the cookie.
tokenValue   | `String` | The token value.

`getCookieValue` is used to return the value of a cookie in a given cookie string. If the cookie specified does not exists in the provided cookie string it will return a rejected promise.

Lets assume we have the following cookie string: `name=luca; surname=tabone;
age=23`. We can use this function to retrieve the value of the `surname` cookie as follows:

```javascript
const cookieString = 'name=luca; surname=tabone; age=23'
getCookieValue(cookieString, 'surname')
  .then(cookieValue => console.log(cookieValue)) // cookieValue === 'tabone'
```

As documented, if we try to retrieve the value of a non-existent cookie, it will return a rejected promise.

```javascript
const cookieString = 'name=luca; surname=tabone; age=23'
getCookieValue(cookieString, 'non-existent-cookie')
  .catch(() => console.log('woops'))
```

## getTokenFromRequest(headers, opts) => Promise(tokenValue)

Argument       | Type     | Description
-------------- | -------- |------------
headers        | `Object` | Object containing the [request header](https://nodejs.org/api/http.html#http_message_headers).
options.cookie | `String` | The name of the cookie containing the access token.
options.header | `String` | The name of the header containing the access token.
tokenValue     | `String` | The token value.

`getTokenFromRequest` retrieves the token value from an HTTP Request. Access Tokens in Notify, can be stored either as a cookie (for logged in users) or as an HTTP Header (mainly for bots). This function is used to retrieve the token from one of these places. If no token is found, it will return a rejected promise.

## getUserByToken(token, opts) => Promise(user)

Argument         | Type              | Description
---------------- | ----------------- |------------
headers          | `Object`|`String` | Access Token.
opts.notifyStore | `Object`          | Notify Store instance being used.
opts.maxAge      | `String`          | The lifetime of an access token.
opts.origin      | `String`          | The origin of the request.
user             | `Object`          | The user which the token belongs to.

`getUserByToken` returns the user associated with a token. This function can be invoked either with the token object itself or the token value (in which case it will first retrieve the token object from the db). If the provided token is not considered to valid, this function will return a rejected promise.

## validateToken(token, opts) => Promise(token)

Argument    | Type     | Description
----------- | -------- |------------
token       | `Object` | Access Token.
opts.maxAge | `String` | The lifetime of an access token.
opts.origin | `String` | The origin of the request.
token       | `Object` | The validated token.

`validateToken` checks whether the token object is valid. A token is considered
to be valid if it meets the following criteria:
  * Token is not expired (if max-age is provided).
  * Token's origin is the same as the origin provided (if origin is provided).
# react-use-credential-management

React hook to leverage Credential Management API

## Usage

Wrap your `<App/>` with `AuthProvider`:

```ts
const App: React.FC = () => {
  return (
    <AuthProvider authenticate={authenticate}>
      <div className="App">{...}</div>
    </AuthProvider>
  )
}
```

The `authenticate` prop must be an **async** function taking a [`PasswordCredentialData`](https://developer.mozilla.org/en-US/docs/Web/API/PasswordCredential/PasswordCredential) as first argument, and returning a complete user profile. Use it to fetch icon URL and full name from backend. Example:

```ts
const authenticate = async ({ id, password }: PasswordCredentialData) => {
  const body = new FormData()
  body.append('id', id)
  body.append('password', password)

  const url = new URL('/auth/login', 'https://example.com')
  const res = await fetch(url.href, { body, method: 'POST' })
  if (!res.ok) {
    throw new Error(res.statusText)
  }

  const { iconURL, name } = await res.json()
  return { id, password, iconURL, name }
}
```

Where `id` is whatever unique value you choose to identify users, be it email, username, or anything else. It will be used to retrieve unique user information from your database.

### Login button

Use `login` to try stored credentials. Pass `'silent'` to prevent asking the user for permission, `'optional'` to optionally ask for consent if needed (otherwise, behaves as `'silent'`), and `'required'` to unconditionally ask for consent.

```ts
const { isLoading, login } = useAuth()

if (isLoading) {
  return null
}

return <button onClick={login('optional')}>Login</button>
```

Use `logout` to require user consent next login:

```ts
const { isLoading, logout } = useAuth()

if (isLoading) {
  return null
}

return <button onClick={logout}>Login</button>
```

Use `isAuthenticated` to check if user is already logged in. You can leverage it to select between login and logout buttons:

```ts
const { isAuthenticated, isLoading, logout, silentLogin } = useAuth()

if (isLoading) {
  return null
}

return isAuthenticated ? (
  <button onClick={logout}>Login</button>
) : (
  <button onClick={login('optional')}>Login</button>
)
```

Use `signup` to create new credentials:

```ts
const { isLoading, signup } = useAuth()
const [isFormOpen, setFormOpen] = useState(false)

if (isLoading) {
  return null
}

const onSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
  e.preventDefault()
  const { elements } = e.currentTarget

  const extract = (name: string) => {
    const el = elements.namedItem(name) as HTMLInputElement
    return el.value
  }
  await signup(extract('id'), extract('password'))
  setFormOpen(false)
}

return (
  <form onSubmit={onSubmit}>
    <p>
      <label>
        <span>Username:</span>
        <input name="id" autoComplete="username" required />
      </label>
    </p>

    <p>
      <label>
        <span>Password:</span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </label>
    </p>

    <button type="submit">Submit</button>
  </form>
)
```

Complete example:

```ts
const { isAuthenticated, isLoading, login, logout, signup } = useAuth()
const [isFormOpen, setFormOpen] = useState(false)

if (isLoading) {
  return null
}

const onSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
  e.preventDefault()
  const { elements } = e.currentTarget

  const extract = (name: string) => {
    const el = elements.namedItem(name) as HTMLInputElement
    return el.value
  }
  await signup(extract('id'), extract('password'))
  setFormOpen(false)
}

const silentLogin = async () => {
  const success = await login('optional')
  setFormOpen(!success)
}

return isAuthenticated ? (
  <button onClick={logout}>Logout</button>
) : isFormOpen ? (
  <form onSubmit={onSubmit}>
    <p>
      <label>
        <span>Username:</span>
        <input name="id" autoComplete="username" required />
      </label>
    </p>

    <p>
      <label>
        <span>Password:</span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </label>
    </p>

    <button type="submit">Submit</button>
  </form>
) : (
  <button onClick={silentLogin}>Login</button>
)
```

## License

This project is licensed under the MIT License - see [LICENSE](LICENSE) for details.

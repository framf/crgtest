import { getInput } from '@actions/core'

// Retrieves the tokens for the data request.
export async function retrieveTokens(): Promise<object> {
  const configuration = JSON.parse(getInput('CONFIGURATION'))

  if (configuration.body) {
    configuration.body = JSON.stringify(configuration.body)
  }

  const response = await fetch(
    'https://strava.com/api/v3/oauth/token',
    configuration,
  )
  return await response.json()
}

// Retrieves the data
export async function retrieveData({
  action,
}: ActionInterface): Promise<object> {
  try {
    const tokens = await retrieveTokens(action)
    const response = await fetch(
      'https://www.strava.com/api/v3/athlete/activities',
      {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      },
    )

    const data = await response.json()

    await fs.writeFile('fetch-api-data-action/data.json', data, 'utf8')
  } catch (error) {
    throw new Error(`There was an error fetching from the API: ${error}`)
  }
}

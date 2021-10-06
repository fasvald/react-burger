const getBearerToken = (accessToken: string): string => {
  return accessToken.split(' ').pop() as string
}

export default getBearerToken

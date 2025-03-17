export type MessageEdit = {
  author: {
    display_name: string,
    username: string,
    avatar_hash: string,
    id: string,
  },
  message: {
    old_content: string,
    content: string,
    id: string,
  }
}
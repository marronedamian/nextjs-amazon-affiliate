export function buildCommentTree(flatComments: any[]) {
  const map: Record<string, any> = {};
  const roots: any[] = [];

  for (const comment of flatComments) {
    comment.replies = [];
    map[comment.id] = comment;
  }

  for (const comment of flatComments) {
    if (comment.parentId) {
      const parent = map[comment.parentId];
      if (parent) parent.replies.push(comment);
    } else {
      roots.push(comment);
    }
  }

  return roots;
}

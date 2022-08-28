export default function postAst(query: string) {
  return fetch('/api/gen-raw-ast', {
    method: 'POST',
    body: JSON.stringify({
      query,
    }),
  }).then((res) => res.json())
}

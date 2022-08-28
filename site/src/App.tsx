import Editor from '@/components/Editor'
import SplitPane from '@/components/SplitPane'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import postAst from './api/postAst'
import ReactJson from 'react-json-view'

function App() {
  const mutation = useMutation(postAst)
  const [query, setQuery] = useState('')

  const handleClick = () => {
    mutation.mutate(query)
  }

  const jsonData = JSON.parse(mutation.data || '{}')
  const handleJsonSelect = (select: any) => {}

  return (
    <div className="App">
      <button onClick={handleClick}>编译</button>
      <SplitPane>
        <Editor
          code={`
CREATE TABLE accounts (
  user_id serial PRIMARY KEY,
  username VARCHAR ( 50 ) UNIQUE NOT NULL,
  password VARCHAR ( 50 ) NOT NULL,
  email VARCHAR ( 255 ) UNIQUE NOT NULL,
  created_on TIMESTAMP NOT NULL,
  last_login TIMESTAMP 
);
`}
          onChange={(content) => {
            setQuery(content)
          }}
        />
        <ReactJson src={jsonData} onSelect={handleJsonSelect} />
      </SplitPane>
    </div>
  )
}

export default App

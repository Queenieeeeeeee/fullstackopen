import { useState } from 'react'

  const Filter = ({ searchTerm, handleSearchTerm }) => {
    return (
      <div>
        filter shown with <input value={searchTerm} onChange={handleSearchTerm}/>
      </div>
    )
  }

  const PersonForm = ({addNote,newName,newNumber,handleNameChange,handleNumberChange}) => {
    return (
      <form onSubmit={addNote}>
        <div>
          name: <input value={newName} onChange={handleNameChange}/>
        </div>
        <div>
          numbers:<input value={newNumber} onChange={handleNumberChange}/>    
        </div>
        <div>
        <button type="submit">add</button>  
        </div>
      </form> 
    )
  }

  const Persons = ({filtershownames}) => {
    return (
      <ul>
          {filtershownames.map(person => 
          <li key={person.name}>{person.name} {person.number}</li>
        )}
      </ul>
    )
  }


const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  
  const handleSearchTerm = (event) => {
    console.log(event.target.value)
    setSearchTerm(event.target.value)
  }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
    }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
    }

  const addNote = (event) => {
    event.preventDefault()

    if (persons.find(person => person.name === newName)) {
    alert(`${newName} is already added to phonebook`)
    return}

    const noteObject = {
      name: newName,
      number: newNumber
    }

  setPersons(persons.concat(noteObject))
  setNewName('')
  setNewNumber('')
}

  const filtershownames = persons.filter(person => person.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter searchTerm={searchTerm} handleSearchTerm={handleSearchTerm} />
      <h3>Add a new</h3>
      <PersonForm addNote={addNote} newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} /> 
      <h2>Numbers</h2>
      <Persons filtershownames={filtershownames} />
    </div>
  )
}

export default App
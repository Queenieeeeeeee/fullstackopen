import { useState, useEffect } from 'react'
import noteService from './services/persons.js'

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

  const Persons = ({filtershownames, deletePerson}) => {
    return (
      <ul>
          {filtershownames.map(person => 
          <li key={person.name}>{person.name} {person.number} <button onClick={() => deletePerson(person.id)}>delete</button></li>
        )}
      </ul>
    )
  }


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  
  useEffect(() => {
  noteService
    .getAll()
    .then(initialNotes => {
      setPersons(initialNotes)
    })
}, [])

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

    const exisitngPerson = persons.find(person => person.name === newName)
    if (exisitngPerson) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?` )) {
        const updatedPerson = { ...exisitngPerson, number: newNumber }
        noteService
          .update(exisitngPerson.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id === exisitngPerson.id ? returnedPerson : person))
            setNewNumber('')
          })
      } 
    }
      else {
        const noteObject = {
        name: newName,
        number: newNumber
      }

      noteService
        .create(noteObject)
        .then(returnedNote => {
          setPersons(persons.concat(returnedNote))
          setNewNumber('')
          setNewName('')
        })
  }
}

  const filtershownames = persons.filter(person => person.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const deletePerson = (id) => {
    const person = persons.find(p => p.id === id)
    if (window.confirm("Delete " + person.name + " ?")) {
    noteService
      .deletePerson(person.id) 
      .then(() => {
        setPersons(persons.filter(p => p.id !== person.id))
      })
  }
}

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter searchTerm={searchTerm} handleSearchTerm={handleSearchTerm} />
      <h3>Add a new</h3>
      <PersonForm addNote={addNote} newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} /> 
      <h2>Numbers</h2>
      <Persons filtershownames={filtershownames} deletePerson={deletePerson} />
    </div>
  )
}

export default App
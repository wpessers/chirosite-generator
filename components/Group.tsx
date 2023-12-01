'use client'

import { clsx } from 'clsx'
import React, { Fragment, useState } from 'react'
import { Combobox, Dialog, Transition } from '@headlessui/react'
import { ClipboardDocumentListIcon, ClipboardDocumentCheckIcon, MagnifyingGlassIcon, PlusCircleIcon, TrashIcon, UserIcon, UserPlusIcon, XCircleIcon } from '@heroicons/react/20/solid'

import { GroupMembers, Person } from '@/interfaces'

export function GroupView({
  groups,
  peopleData,
}: {
  groups: string[],
  peopleData: Person[],
}) {
  console.log(peopleData)
  const [unassignedPeople, setUnassignedPeople] = useState<Person[]>(peopleData)
  const [groupMembers, setGroupMembers] = useState<GroupMembers>(() => {
    const initMembers: GroupMembers = {}
    groups.forEach(group => {
      initMembers[group] = []
    })
    return initMembers
  })

  const addPersonToGroup = (groupName: string, person: Person) => {
    setGroupMembers((prev: GroupMembers) => ({
      ...prev,
      [groupName]: [...prev[groupName], person]
    }))
    setUnassignedPeople((prevPeople: Person[]) => prevPeople.filter(p => p.id !== person.id))
  }

  return (
    <>
      {groups.map((group, index) => (
        <GroupCard
          name={group}
          groupMembers={groupMembers[group]}
          setGroupMembers={setGroupMembers}
          unassignedPeople={unassignedPeople}
          setUnassignedPeople={setUnassignedPeople}
          addPerson={addPersonToGroup}
          key={index}/>
      ))}
    </>
  )
}


function GroupCard({
  name,
  groupMembers,
  setGroupMembers,
  unassignedPeople,
  setUnassignedPeople,
  addPerson,
}: {
  name: string,
  groupMembers: Person[],
  setGroupMembers: React.Dispatch<React.SetStateAction<GroupMembers>>,
  unassignedPeople: Person[],
  setUnassignedPeople: React.Dispatch<React.SetStateAction<Person[]>>,
  addPerson: (groupName: string, person: Person) => void,
}) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);
  const removePersonFromGroup = (groupName: string, id: string) => {
    const person = groupMembers.find(p => p.id == id)
    setGroupMembers((prev: GroupMembers) => ({
      ...prev,
      [groupName]: [...prev[groupName].filter(p => p.id !== id)]
    }))

    if (person) {
      setUnassignedPeople((prevPeople: Person[]) => [...prevPeople, person])
    }
  }

  const groupMembersToHtml = () => {
    let groupHtml = ''
    groupMembers.forEach((p) => groupHtml += personToHtml(p) + '\n')
    navigator.clipboard.writeText(groupHtml)
  }

  const personToHtml = (person: Person) => {
    return `<div>
  <table border="0">
    <tbody>
      <tr>
        <th style="width:50%"><img src="/sites/chiromejoca.chirosite.be/files/wysiwyg/website/2021/leiding/individueel/${person.first_name.toLowerCase()}${person.last_name.toLowerCase()}.jpg" style="width:100%" /></th>
        <th style="width:50%; font-weight:normal">
          <h1>${person.first_name} ${person.last_name}</h1>

          <p align="left" style="margin-left:11.25pt"><strong>Adres: </strong> ${person.street} ${person.house_number}<br />
            <strong>GSM: </strong> ${person.phone_number}<br />
            <strong>E-mailadres: </strong> ${person.email}<br />
            <strong>Functie: </strong> ${person.responsibilities}<br />
            <strong>Studies/Job: </strong> ${person.education_occupation}<br />
            <strong>Hobby&#39;s: </strong> ${person.hobbies}<br />
            <strong>Lievelingskleur: </strong> ${person.fav_color}<br />
            <strong>Favoriete Chiro-activiteit: </strong> ${person.fav_activity}<br />
            <strong>Favoriete Chirolied: </strong> ${person.fav_song}<br />
            <strong>Leukste kamp: </strong> ${person.fav_camp}<br />
            <strong>Lievelingsmuziek: </strong> ${person.fav_music_genre}<br />
            <strong>Lievelingsfilm of -boek: </strong> ${person.fav_film_book}<br />
            <strong>Aantal jaren in de chiro: </strong> ${person.years_active}<br />
            <strong>Reeds leiding geweest van: </strong> ${person.prev_groups}<br />
            <strong>Verjaardag: </strong> ${person.birth_date}</p>
        </th>
      </tr>
    </tbody>
  </table>
</div>
    `
  }

  const [copyIcon, setCopyIcon] = useState('clipboard')
  const handleCopyClick = () => {
    groupMembersToHtml()
    setCopyIcon('check')
    setTimeout(() => setCopyIcon('clipboard'), 2000)
  }

  return (
    <>
      <div className="overflow-hidden rounded-md bg-gray-800 shadow my-4">
          <div className="flex justify-between border-b-2 border-gray-600 bg-gray-800 px-4 py-5 sm:px-6">
            <h3 className="text-base font-semibold leading-6 text-gray-100">{name}</h3>
            <div className="flex text-gray-400">
              <button className="hover:text-gray-100" onClick={toggleSearch}>
                <UserPlusIcon className="h-5 w-5" aria-hidden="true" />
              </button>
              <button className="ml-4 hover:text-gray-100" onClick={handleCopyClick}>
                {copyIcon === 'clipboard' ? <ClipboardDocumentListIcon className="h-5 w-5" aria-hidden="true"/> : <ClipboardDocumentCheckIcon className="h-5 w-5 text-gray-100" aria-hidden="true"/>}
              </button>
            </div>
          </div>
          <ul>
            {groupMembers.map((person, index) => (
              <GroupListItem id={person.id} name={`${person.first_name} ${person.last_name}`} groupName={name} remove={removePersonFromGroup} key={index}/>
            ))}
          </ul>
          {isSearchOpen && <Search people={unassignedPeople} onAddPerson={(person) => addPerson(name, person)} onClose={() => setIsSearchOpen(false)} />}
        </div>
    </>
  )
}

function GroupListItem({
  id,
  name,
  groupName,
  remove,
}: {
  id: string,
  name: string,
  groupName: string,
  remove: (groupName: string, id: string) => void
}) {
  return (
    <>
      <li className="flex items-center justify-between px-6 py-4 text-gray-400">
        <p>{name}</p>
        <button className="text-gray-400 hover:text-red-400" onClick={() => remove(groupName, id)}>
          <TrashIcon className="h-5 w-5"/>
        </button>
      </li>
    </>
  )
}

function Search({
  people,
  onAddPerson,
  onClose,
}: {
  people: Person[],
  onAddPerson: (person: Person) => void,
  onClose: () => void,
}) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(true)

  const filteredPeople =
    query === ''
      ? []
      : people.filter((person) => {
          return person.first_name.toLowerCase().includes(query.toLowerCase()) || person.last_name.toLowerCase().includes(query.toLowerCase())
        })

  const handleSelect = (person: Person) => {
    onAddPerson(person);
  }

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  return (
    <Transition.Root show={open} as={Fragment} afterLeave={() => setQuery('')} appear>
      <Dialog as="div" className="relative z-10" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-25 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto p-4 sm:p-6 md:p-20">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="mx-auto max-w-2xl transform divide-y divide-gray-500 divide-opacity-20 overflow-hidden rounded-xl bg-gray-900 shadow-2xl transition-all">
              <Combobox onChange={handleSelect}>
                <div className="relative">
                  <MagnifyingGlassIcon
                    className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-gray-500"
                    aria-hidden="true"
                  />
                  <Combobox.Input
                    className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-white focus:ring-0 sm:text-sm"
                    placeholder="Search..."
                    onChange={(event) => setQuery(event.target.value)}
                  />
                  <button
                    className="absolute right-4 top-3"
                    onClick={onClose}
                  >
                    <XCircleIcon className="h-6 w-6 text-gray-500"/>
                  </button>
                </div>
                <Combobox.Options
                  static
                  className="max-h-80 scroll-py-2 divide-y divide-gray-500 divide-opacity-20 overflow-y-auto"
                >
                  <ul className="text-sm text-gray-400">
                    {filteredPeople.map((person) => (
                      <Combobox.Option
                        key={person.id}
                        value={person}
                        className={({ active }) =>
                        clsx(
                            'flex cursor-default select-none items-center rounded-md px-3 py-2',
                            active && 'bg-gray-800 text-white'
                          )
                        }
                      >
                        {({ active }) => (
                          <>
                            <UserIcon
                              className={clsx('h-6 w-6 flex-none', active ? 'text-white' : 'text-gray-500')}
                              aria-hidden="true"
                            />
                            <span className="ml-3 flex-auto truncate">{person.first_name} {person.last_name}</span>
                            {active && (
                              <button
                                className="ml-3 mr-1 flex-none text-gray-400 hover:text-gray-100"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onAddPerson(person)
                                }}
                              >
                                <PlusCircleIcon className="h-5 w-5"/>
                              </button>
                            )}
                          </>
                        )}
                      </Combobox.Option>
                    ))}
                  </ul>
                </Combobox.Options>

                {query !== '' && filteredPeople.length === 0 && (
                  <div className="px-6 py-14 text-center sm:px-14">
                    <p className="mt-4 text-sm text-gray-200">
                      We couldn't find any people with that name.
                    </p>
                  </div>
                )}
              </Combobox>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
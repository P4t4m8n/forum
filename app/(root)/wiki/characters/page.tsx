import { getCharacters } from '@/lib/actions/wiki/character.action'
import { getAllTitles, getCharacterTitles } from '@/lib/actions/wiki/characterTitle.action'
import React from 'react'

export default async function CharactersServer() {

    const characters = await getCharacters()
    const titles = await getAllTitles()
    console.log("titles:", titles)
    // console.log("characters:", characters)
  return (
    <div>page</div>
  )
}

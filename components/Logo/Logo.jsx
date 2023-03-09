import { faBrain } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

export default function Logo() {
  return (
    <div className='py-4 text-3xl text-center font-heading'>Blog Standard
    <FontAwesomeIcon icon={faBrain} className='text-2xl text-slate-400'/>
    </div>
  )
}

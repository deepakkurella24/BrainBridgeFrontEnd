import React from 'react'
import Card from './Card'
import ShimmerCard from './ShimmerCard'

const CardsContainer = ({users,hasMore,updateTo,parent}) => {
  // return (
  //   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  //       {users.map((u) => (
  //       <Card key={u._id} u={u} updateTo={updateTo} parent={parent} />
  //       ))}
  //       {
  //       hasMore&&(
  //           <>
  //           <ShimmerCard/>
  //           <ShimmerCard/>
  //           </>
  //       )
  //       }
  //   </div>699477260d7a07177717d47e
  // )
  return (
    /* ADDED: w-full here */
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((u) => (
          <Card key={u._id} u={u} updateTo={updateTo} parent={parent} />
        ))}
        {
        hasMore && (
            <>
            <ShimmerCard/>
            <ShimmerCard/>
            </>
        )
        }
    </div>
  )
}

export default CardsContainer
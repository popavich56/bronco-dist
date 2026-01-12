import React from "react"

import AddAddress from "../address-card/add-address"
import EditAddress from "../address-card/edit-address-modal"
import { Customer, Region } from "@xclade/types"

type AddressBookProps = {
  customer: Customer
  region: Region
}

const AddressBook: React.FC<AddressBookProps> = ({ customer, region }) => {
  const { addresses } = customer
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 mt-4">
        <AddAddress
          region={region}
          addresses={addresses.filter((a): a is NonNullable<typeof a> => !!a)}
        />
        {addresses
          .filter((a): a is NonNullable<typeof a> => !!a)
          .map((address) => {
            return (
              <EditAddress region={region} address={address} key={address.id} />
            )
          })}
      </div>
    </div>
  )
}

export default AddressBook

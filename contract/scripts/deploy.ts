import { 
  Contract, 
  ContractFactory 
} from "ethers"
import { ethers } from "hardhat"

const main = async(): Promise<any> => {
  const FestivalGreetings: ContractFactory = await ethers.getContractFactory("FestivalGreetings")
  const festivalGreetings: Contract = await FestivalGreetings.deploy()

  await festivalGreetings.deployed()
  console.log(`FestivalGreetings NFT contract deployed to: ${festivalGreetings.address}`)
}

main()
.then(() => process.exit(0))
.catch(error => {
  console.error(error)
  process.exit(1)
})

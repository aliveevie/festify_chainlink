const hre = require("hardhat")

async function main() {
  const contractAddress = "0xafCb97ab5631112A09031732CccB3Ece83E3fEa6"
  
  console.log("Verifying contract...")
  
  try {
    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: []
    })
    console.log("Contract verified successfully!")
  } catch (error) {
    if (error.message.includes("Already Verified")) {
      console.log("Contract is already verified!")
    } else {
      console.error("Error verifying contract:", error)
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  }) 
import { core } from "@actions/core"
import { fs } from "node:fs"

// expect that this will be in the working directory
import data from "./infra/app.config.json"

try {
    const regionKey = core.getInput('region_name')
    const environmentKey = core.getInput('environment_name')
    const keyvaultNameSuffix = core.getInput('keyvault_name_suffix')
    const outputFilePath = core.getInput('output_file_path')

    const baseVaultReference = `@Microsoft.KeyVault(SecretUri=https://racwa-${regionKey}-key-${environmentKey}-${keyvaultNameSuffix}.vault.azure.net/secrets`

    const apiKeyString = `${baseVaultReference}/AppSettings--ApimApiKey)`
    const appConfigString = `${baseVaultReference}/AzureAppConfigurationConnectionString)`

    const combinedJson = Object.assign({}, data.common, data[environmentKey], data.keyVaultRef)

    // replace keyVault references
    combinedJson.AppSettings__ApimApiKey = apiKeyString
    combinedJson.AzureAppConfigurationConnectionString = appConfigString

    fs.writeFileSync(outputFilePath, JSON.stringify(combinedJson))
} catch (error) {
    core.setFailed(error.message)
}
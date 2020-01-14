const fs = require('fs')
const path = require('path')
const jsonc = require('jsonc')

const manifestPath = path.join('.', 'package.json')
const manifestContent = fs.readFileSync(manifestPath)
const manifest = jsonc.parse(manifestContent)

const safeName = manifest.name.replace(/\W+/g, '-').replace(/^-|-$/g, '')
const licenseUrl = `https://spdx.org/licenses/${manifest.license}.html#licenseText`

const now = new Date()

// consent-o-matic
async function consentomatic() {
	const root = 'consent-o-matic'
	const src = 'rules.d'
	const ext = '.json'

	const rootDir = path.join('.', root)
	const srcDir = path.join(rootDir, src)
	const files = await fs.promises.readdir(srcDir)
	const contents = files.map(
		async function(file) {
			const filePath = path.join(srcDir, file)
			const content = await fs.promises.readFile(filePath)
			const data = jsonc.parse(content.toString())
			return data
		}
	)
	const dataList = await Promise.all(contents)
	const data = Object.assign({}, ...dataList)
	const content = jsonc.stringify(data, null, 4)
	const destFileName = safeName + '--' + root + ext
	const destFilePath = path.join(rootDir, destFileName)
	await fs.promises.writeFile(destFilePath, content)
}

async function ublockorigin() {
	const root = 'ublock-origin'
	const src = 'filters.d'
	const ext = '.txt'
	const header = `
! Title: ${manifest.name} filters
! Expires: 1 days
! Description: Filters optimized for uBlock origin. ${manifest.description}
! Homepage: ${manifest.homepage}
! Licence: ${licenseUrl}
! 
! GitHub issues: ${manifest.bugs.url}
! GitHub pull requests: ${manifest.homepage}
!
! Last updated: ${now.toISOString()}
`.replace(/^\r?\n/mg, '')
	
	const rootDir = path.join('.', root)
	const srcDir = path.join(rootDir, src)
	const files = await fs.promises.readdir(srcDir)
	const contents = files.map(
		async function(file) {
			const filePath = path.join(srcDir, file)
			const content = await fs.promises.readFile(filePath)
			const sectionHeader = `! *** ${filePath} ***\n`
			const data = (sectionHeader + content + "\n").replace(/(\r?\n)+$/, "\n")
			return data
		}
	)
	const dataList = await Promise.all(contents)
	const content = [header, ...dataList].join("\n")
	const destFileName = safeName + '--' + root + ext
	const destFilePath = path.join(rootDir, destFileName)
	await fs.promises.writeFile(destFilePath, content)
}

consentomatic().then(e => console.log('Consent-o-matic done.')).catch(e => console.error(e))
ublockorigin().then(e => console.log('Ublock-origin done.')).catch(e => console.error(e))


#Requires -Version 5.1

Param(
  [Parameter(Mandatory=$true)]
  [String]
  $hostname,
  
  [Parameter(Mandatory=$true)]
  [String]
  $path
)

Write-Output "Deploy on $($hostname):$($path) started..."

$scriptDirectory = Split-Path -parent $MyInvocation.MyCommand.Path
$solutionDirectory = Split-Path -parent $scriptDirectory

Push-Location "$($solutionDirectory)\Univie.Assistant.Frontend"
npm install
npm run-script build
Pop-Location

scp -r "$($solutionDirectory)\Univie.Assistant.Frontend\build\*" "$($hostname):$($path)"

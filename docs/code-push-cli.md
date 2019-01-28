- [access-key](#access-key)
  - [add](#add)
  - [remove(rm)](#removerm)
  - [list(ls)](#listls)
- [app](#app)
  - [add](#add-1)
  - [remove(rm)](#removerm-1)
  - [rename](#rename)
  - [list(ls)](#listls-1)
- [collaborator](#collaborator)
  - [add](#add-2)
  - [remove(rm)](#removerm-2)
  - [list(ls)](#listls-2)
- [debug](#debug)
- [deployment](#deployment)
- [link](#link)
- [login](#login)
- [logout](#logout)
- [patch](#patch)
- [promote](#promote)
- [register](#register)
- [release](#release)
- [release-cordova](#release-cordova)
- [release-react](#release-react)
- [rollback](#rollback)
- [whoami](#whoami)

# access-key   
## add
 code-push access-key add <accessKeyName>
## remove(rm)
 code-push access-key remove <accessKeyName>
## list(ls)   
# app  
## add
code-push app add <appName> <os> <platform>
## remove(rm)
 code-push app remove <appName>
## rename
code-push app rename <currentAppName> <newAppName>
## list(ls)           
# collaborator   
## add
## remove(rm)
## list(ls)  
code-push collaborator ls <appName> [options]
# debug            
# deployment      
# link    
# login        
# logout        
# patch          
# promote    
# register      
# release          
# release-cordova 
# release-react   
code-push release-react  <appName> <platform> [options]
options:
* --bundleName -b 
* --deploymentName -d // default:"Staging"
* --development --dev // default:"false"
* --disabled -x // default:"false"
* --entryFile -e // default:"null"
* --gradleFile -g // default:"null"
* --mandatory -m // default:"false"
* --noDuplicateReleaseError // default:"false"
* --plistFile -p // default:"null"
* --plistFilePrefix -pre // default:"null"
* --rollout -r // default:"100%"
* --privateKeyPath -k // default:false
* --sourcemapOutput -s // default:null
* --targetBinaryVersion -t // default:null
* --outputDir -o // default:null
* --cobfig -c // default:null
# rollback         
# whoami 

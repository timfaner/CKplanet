
##  Data Server
### About Data Server
data server provide service for dapp and communicates with the ckb chain
### How to Install
1.  **How to Install JDK on Ubuntu**
---
There are several JDK implementations available for Linux, such as Oracle JDK, OpenJDK, Sun JDK, IBM JDK and GNU Java Compiler. We shall choose the Oracle JDK 8. Ubuntu chooses OpenJDK as its default JDK, which is not 100% compatible with Oracle JDK.

- **Step 1: Download and Install JDK**

1.Goto JDK (Java SE) download site @ [http://www.oracle.com/technetwork/java/javase/downloads/index.html](http://www.oracle.com/technetwork/java/javase/downloads/index.html). Under "Java Platform, Standard Edition" ⇒ "Java SE 11.0.{x}" ⇒ Click JDK's "Download" ⇒ Under "Java SE Development Kit 11.0.{x}" ⇒ Check "Accept License Agreement" ⇒ Select "Linux", "tar.gz" package, (e.g., "jdk-13.0.{x}-linux-x64_bin.tar.gz" - 171MB).
The tarball will be downloaded in directory "~/Downloads", by default.
2.We shall install JDK under "/usr/local/java" (or Ubuntu's default JDK directory /usr/lib/jvm; or /opt/java). First, create a directory "java" under "/usr/local". Open a Terminal and issue these commands:

```bash
$ cd /usr/local
$ sudo mkdir java
```

Extract the downloaded package (Check your downloaded filename!)

```bash
$ cd /usr/local/java
$ sudo tar xzvf ~/Downloads/jdk-13.0.{x}-linux-x64_bin.tar.gz
       // x: extract, z: for unzipping gz, v: verbose, f: filename
```

JDK shall be extracted in a folder "/usr/local/java/jdk-13.0.{x}", where {x} is the update number.
3.Inform the Ubuntu to use this JDK/JRE:

```bash
// Setup the location of java, javac and javaws
$ sudo update-alternatives --install "/usr/bin/java" "java" "/usr/local/java/jdk-13.0.{x}/bin/java" 1
      // --install symlink name path priority
$ sudo update-alternatives --install "/usr/bin/javac" "javac" "/usr/local/java/jdk-13.0.{x}/bin/javac" 1
$ sudo update-alternatives --install "/usr/bin/javaws" "javaws" "/usr/local/java/jdk-13.0.{x}/bin/javaws" 1
// Use this Oracle JDK/JRE as the default
$ sudo update-alternatives --set java /usr/local/java/jdk-13.0.{x}/bin/java
      // --set name path
$ sudo update-alternatives --set javac /usr/local/java/jdk-13.0.{x}/bin/javac
$ sudo update-alternatives --set javaws /usr/local/java/jdk-13.0.{x}/bin/javaws
```
The above steps set up symlinks java, javac, javaws at /usr/bin (which is in the PATH), that link to /etc/alternatives and then to JDK bin directory.
The "alternatives" system aims to resolve the situation where several programs fulfilling the same function (e.g., different version of JDKs). It sets up symlinks thru /etc/alternatives to refer to the actual programs to be used.
```bash
$ ls -ld /usr/bin/java*
lrwxrwxrwx 1 root root xx xxx xx xx:xx /usr/bin/java -> /etc/alternatives/java
lrwxrwxrwx 1 root root xx xxx xx xx:xx /usr/bin/javac -> /etc/alternatives/javac
lrwxrwxrwx 1 root root xx xxx xx xx:xx /usr/bin/javaws -> /etc/alternatives/javaws

$ ls -ld /etc/alternatives/java*
lrwxrwxrwx 1 root root xx xxx xx xx:xx /etc/alternatives/java -> /usr/local/java/jdk-13.0.{x}/bin/java
lrwxrwxrwx 1 root root xx xxx xx xx:xx /etc/alternatives/javac -> /usr/local/java/jdk-13.0.{x}/bin/javac
lrwxrwxrwx 1 root root xx xxx xx xx:xx /etc/alternatives/javaws -> /usr/local/java/jdk-13.0.{x}/bin/javaws
```
Alternatively, you can include the JDK's bin and JRE's bin into the PATH directly.
4. To verify the JDK installation, issue these commands:
```bash
// Show the Java Compiler (javac) version
$ javac -version
javac 11.0.{x}
 
// Show the Java Runtime (java) version
$ java -version
java version "11.0.{x}"
......
 
// Show the location of javac and java
$ which javac
/usr/bin/javac

$ which java
/usr/bin/java
```
5.[Don't Do this step - It is taken care by "alternative" in Step 3. Keep here to show you how to set PATH.]
Add JDK's binary directory ("bin") to the "PATH" by editing "/etc/profile":
```bash
$ cd /etc
$ gksudo gedit profile   // OR "sudo nano profile" to use the console-based nano editor
```
Add these lines at the end of the file "/etc/profile", replace "{x}" with the actual number:
```bash
export JAVA_HOME=/usr/local/java/jdk-13.0.{x}
export PATH=$JAVA_HOME/bin:$PATH
```
Rerun the configuration file by:
```bash
// Refresh
$ source /etc/profile
 
// Check the new settings for JAVA_HOME and PATH
$ echo $JAVA_HOME
/usr/local/java/jdk-13.0.{x}
 
$ echo $PATH
.....:/usr/local/java/jdk-13.0.{x}/bin
```
- **Step 2: Compile and Run a Hello-world Java Program**

1.File Explorer ⇒ Home ⇒ Create a new folder called "myProject" to keep our works.
2.Open "Text Editor" (gedit). Enter the following source code and save as "Hello.java" under the "~/myProject" directory created earlier.
```java
public class Hello {   // To save as "Hello.java" under "~/myProject"
   public static void main(String[] args) {
      System.out.println("Hello, world from Ubuntu!");
   }
}
```
3.To compile the Hello-world Java program, launch a Terminal and issue these commands:
```bash
// Change directory to where the source code resides
$ cd ~/myProject
 
// List the contents of current directory. Check for "Hello.java"
$ ls
...... Hello.java ......
 
// Compile "Hello.java" into "Hello.class"
$ javac Hello.java
 
// Check for "Hello.class"
$ ls
...... Hello.class ......
```
4.Run the Hello-world Java program:
```bash
// Run "Hello.class"
$ java Hello
Hello, world from Ubuntu!
```
1.  **How to Install Mogodb on Ubuntu**
---
- **Step 1: Import the MongoDB repository**

Import the public key used by the package management system.
The Ubuntu package management tools ensure package consistency and authenticity by verifying that they are signed with GPG keys. The following command will import the MongoDB public GPG key.
```bash
> sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10</span>
```
Create a source list file for MongoDB
Create the /etc/apt/sources.list.d/mongodb-org-3.4.list list file using the command below.
```bash
> echo "deb http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.4 multiverse" | sudo 
tee /etc/apt/sources.list.d/mongodb-org-3.4.list
```
Update the local package repository
```bash
> sudo apt-get update
```
- **Step 2: Install the MongoDB packages**
Install the latest stable version of MongoDB:
```bash
> sudo apt-get install -y mongodb-org
```
Install a specific release of MongoDB:
You must specify each component package specifically with their version number, check the following example:
```bash
> sudo apt-get install -y mongodb-org=3.4 mongodb-org-server=3.4 mongodb-org-shell=3.4 mongodb-org-mongos=3.4 mongodb-org-tools=3.4
```
- **Step 3: Launch MongoDB as a service on Ubuntu 16.04**

We need to create a unit file, which tells systemd how to manage a resource. Most common unit type, service, determine how to start or stop the service, auto-start etc.

Create a configuration file named mongodb.service in /etc/systemd/system to manage the MongoDB service.
```bash
> sudo vim /etc/systemd/system/mongodb.service
```
Copy the following contents in the file.
```bash
#Unit contains the dependencies to be satisfied before the service is started.
[Unit]
Description=MongoDB Database
After=network.target
Documentation=https://docs.mongodb.org/manual
#Service tells systemd, how the service should be started.
#Key `User` specifies that the server will run under the mongodb user and
#`ExecStart` defines the startup command for MongoDB server.
[Service]
User=mongodb
Group=mongodb
ExecStart=/usr/bin/mongod --quiet --config /etc/mongod.conf
#Install tells systemd when the service should be automatically started.
#`multi-user.target` means the server will be automatically started during boot.
[Install]
WantedBy=multi-user.target
```
Update the systemd service with the command stated below:
```bash
> systemctl daemon-reload
```
Start the service with systemcl.
```bash
> sudo systemctl start mongodb
```
Check if mongodb has been started on port 27017 with netstat command:

```bash
> netstat -plntu
```

Check if the service has started properly.

```bash
> sudo systemctl status mongodb
```

The output to the above command will show `active (running)` status with the PID and Memory/CPU it is consuming.

Enable auto start MongoDB when system starts.

```bash
> sudo systemctl enable mongodb
```

Stop MongoDB

```bash
> sudo systemctl stop mongodb
```

Restart MongoDB

```bash
> sudo systemctl restart mongodb
```

- **Step 4: Configure and Connect MongoDB**
Open mongo shell
Open MongoDB shell on your server by typing below command:

```bash
> mongo
```

Switch to the database admin

```bash
> use admin
```

Create the root user
```bash
> db.createUser({user:"admin", pwd:”password", roles:[{role:"root", db:"admin"}]})
 ```
Exit from the MongoDB shell.
Connect MongoDB
Restart MongoDB( command mentioned above ) and connect with user created with this command:

```bash
> mongo -u admin -p admin123 --authenticationDatabase admin
```

You can see the mongo connecting. Check the databases using the following command:

```bash
> show dbs
```
1.  **How to Install Data Server in Ubuntu**
---
Open mongo shell
```bash
> mongo
```
create a database user

```bash
> use user
```
then  run the java jar in ubuntu
```bash
java -jar dsdsdsd.jar --port=[port] [rpcAddress]
```
### How to Use
 1. /v2/getMpk
 - description：return the data server's public key 
 - request method:POST
 - input: 
 - out: 
 - postman case:
 2. /v2/Auth
 - description：
 - request method:POST
 - input: 
 - out: 
 - postman case:
  2. /v2/postData
 - description： 
 - request method:POST
 - input: 
 - out: 
 - postman case:
   2. /v2/postDataWithoutValid
 - description：
 - request method:POST
 - input: 
 - out: 
 - postman case:
 2. /v2/getData
 - description：
 - request method:POST
 - input: 
 - out: 
 - postman case:
 2. /v2/valid
 - description：
 - request method:POST
 - input: 
 - out: 
 - postman case:



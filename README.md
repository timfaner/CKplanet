
##  Data Server
### About Data Server

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
- install java 
- install mogodb
- run data server
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

JFLAGS = -g
JC = javac
.SUFFIXES: .java .class
.java.class:
	$(JC) $(JFLAGS) $*.java

CLASSES = \
	ProblemIdToJson.java \
	org/eclipse/jdt/core/compiler/IProblem.java \
	ProblemReasons.java 

default: classes

classes: $(CLASSES:.java=.class)

clean:
	$(RM) *.class

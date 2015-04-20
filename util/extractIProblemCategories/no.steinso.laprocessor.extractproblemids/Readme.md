# Utility for extracting problem marker categories from the IProblem class.
Copy the IProblem class into IProblem.java, and run the ProblemIdToJson java program.
The output will be a JavaScript object from ids to category names.

The utility also prints an array of the names of the more general categories that 
the other categories fit into. The general category for each id can be found by
bitmasking with the general category id. NOTE: Any category id can have more than one
general category.

To generate:
	make
	java ProblemIdToJson > problemCategories.js

#compiler
CPP := g++ -O3

#linker
LD := g++

#compiler flags
CPPFLAGS := -I/usr/local/include/opencv2 \
            -I/usr/local/include/opencv \
	    -I/usr/local/include

#linker flags
LDFLAGS := -L/usr/local/lib

#libraries
LIBS := -lopencv_core \
	-lopencv_imgproc \
	-lopencv_highgui

#remove command
RM := rm

#package command
PACK := tar

#name of produced binary
BIN := Gaussian

#project directories containing the source code
PROJECTDIRS := .

#source files
#SRC := $(shell find $(PROJECTDIRS) -type f -name "*.cpp")
SRC := Gaussian.cpp

#header files
INC := $(shell find $(PROJECTDIRS) -type f -name "*.h")
INC += $(shell find $(PROJECTDIRS) -type f -name "*.hpp")

#object files
OBJ := $(patsubst %.cpp,%.o,$(SRC))

#dependancy files
DEP := $(patsubst %.cpp,%.d,$(SRC))

#auxiliary files
AUX := BlinkMakefile

#all files for packaging
ALL := $(SRC) $(INC) $(AUX)

.PHONY : all clean package print

#link rule
all : $(BIN) 

$(BIN) : $(OBJ)
	@$(LD) $(LDFLAGS) -o $(BIN) $(OBJ) $(LIBS)	

#compile rule
%.o : %.cpp Makefile	
	@$(CPP) $(CPPFLAGS) -MMD -MP -c  $< -o $@

#dependencies rules
-include $(DEP)	

#clean rule
clean :
	-@$(RM) -f $(BIN) $(OBJ) $(DEP) $(BIN).tar.gz

#package rule
package :
	@$(PACK) czf $(BIN).tar.gz $(ALL)

print:
	@echo $(OBJ)

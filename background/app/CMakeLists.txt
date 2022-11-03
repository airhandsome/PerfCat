# For more information about using CMake with Android Studio, read the
# documentation: https://d.android.com/studio/projects/add-native-code.html

# Sets the minimum version of CMake required to build the native library.

cmake_minimum_required(VERSION 3.4.1)

# set(PREBUILT_LIB_PATH ${CMAKE_CURRENT_SOURCE_DIR}/src/main/prebuilt/lib)
# set(PREBUILT_INCLUDE_PATH ${CMAKE_CURRENT_SOURCE_DIR}/src/main/prebuilt/include)

project(native-lib)

if(CMAKE_BUILD_TYPE MATCHES Debug)
    Message(***Build type***, add debug marcos)
    add_definitions(-DEE_DEBUG -DUNITY_ANDROID=1)
endif()
if(CMAKE_BUILD_TYPE MATCHES Release)
    Message(***Build type***, add release marcos)
    add_definitions(-DEE_RELEASE -DUNITY_ANDROID=1)
endif()

include_directories(src/main/native/)
# include_directories(${PREBUILT_INCLUDE_PATH})
add_subdirectory(src/main/native/HWCPipe)
add_subdirectory(src/main/native/Perfcounter)
file(GLOB wrapper src/main/native/Wrapper/JniWrapper.cpp)

add_library(native-lib SHARED ${wrapper})

target_link_libraries(native-lib hwcpipe)
target_link_libraries(native-lib adrenopipe)


find_library(log-lib log)
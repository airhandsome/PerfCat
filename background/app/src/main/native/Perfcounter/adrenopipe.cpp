//
// Created by y on 2022/10/14.
//

#include "adrenopipe.h"
static void *allocate(void *user_data, size_t size) { return malloc(size); }
static void deallocate(void *user_data, void *memory) { return free(memory); }

AdrenoPipe *AdrenoPipe::_instance = NULL;
hpc_gpu_adreno_a6xx_counter_t* a6xx_counters;
hpc_gpu_adreno_a5xx_counter_t* a5xx_counters;


AdrenoPipe *AdrenoPipe::Instance()
{
    if (!_instance){
      _instance = new AdrenoPipe();
    }
    return _instance;
}

AdrenoPipe *AdrenoPipe::Instance(hpc_gpu_adreno_a6xx_counter_t* gpu_counter, int length)
{
  _instance = new AdrenoPipe(gpu_counter, length);
  return _instance;
}


AdrenoPipe::AdrenoPipe() {

  a6xx_counters = new hpc_gpu_adreno_a6xx_counter_t[]{
      HPC_GPU_ADRENO_A6XX_CP_BUSY_GFX_CORE_IDLE,
      HPC_GPU_ADRENO_A6XX_CP_BUSY_CYCLES,

      HPC_GPU_ADRENO_A6XX_TP_L1_CACHELINE_REQUESTS,
      HPC_GPU_ADRENO_A6XX_TP_L1_CACHELINE_MISSES,

      HPC_GPU_ADRENO_A6XX_TP_OUTPUT_PIXELS_POINT,
      HPC_GPU_ADRENO_A6XX_TP_OUTPUT_PIXELS_BILINEAR,
      HPC_GPU_ADRENO_A6XX_TP_OUTPUT_PIXELS_MIP,
      HPC_GPU_ADRENO_A6XX_TP_OUTPUT_PIXELS_ANISO,
      HPC_GPU_ADRENO_A6XX_TP_OUTPUT_PIXELS_ZERO_LOD,

      HPC_GPU_ADRENO_A6XX_PC_VERTEX_HITS,
      HPC_GPU_ADRENO_A6XX_PC_TSE_VERTEX,
      HPC_GPU_ADRENO_A6XX_CP_MEMORY_POOL_EMPTY,
      HPC_GPU_ADRENO_A6XX_CP_MEMORY_POOL_SYNC_STALL,
      HPC_GPU_ADRENO_A6XX_CP_MEMORY_POOL_ABOVE_THRESH,
      HPC_GPU_ADRENO_A6XX_PC_NON_DRAWCALL_GLOBAL_EVENTS,
  };
  a5xx_counters = new hpc_gpu_adreno_a5xx_counter_t[]{
      HPC_GPU_ADRENO_A5XX_CP_BUSY_GFX_CORE_IDLE,
      HPC_GPU_ADRENO_A5XX_CP_BUSY_CYCLES,

      HPC_GPU_ADRENO_A5XX_TP_L1_CACHELINE_REQUESTS,
      HPC_GPU_ADRENO_A5XX_TP_L1_CACHELINE_MISSES,

      HPC_GPU_ADRENO_A5XX_TP_OUTPUT_PIXELS_POINT,
      HPC_GPU_ADRENO_A5XX_TP_OUTPUT_PIXELS_BILINEAR,
      HPC_GPU_ADRENO_A5XX_TP_OUTPUT_PIXELS_MIP,
      HPC_GPU_ADRENO_A5XX_TP_OUTPUT_PIXELS_ANISO,
      HPC_GPU_ADRENO_A5XX_TP_OUTPUT_PIXELS_ZERO_LOD,

      HPC_GPU_ADRENO_A5XX_PC_VERTEX_HITS,
      HPC_GPU_ADRENO_A5XX_PC_NON_DRAWCALL_GLOBAL_EVENTS,
  };
  num_counters = 11;
  type = -1;
}

AdrenoPipe::AdrenoPipe(hpc_gpu_adreno_a6xx_counter_t* gpu_counters, int length) {
  a6xx_counters = gpu_counters;
  num_counters = length;
}


AdrenoPipe::AdrenoPipe(hpc_gpu_adreno_a5xx_counter_t* gpu_counters, int length) {
  a5xx_counters = gpu_counters;
  num_counters = length;
}

int AdrenoPipe::run() {
  allocator = {NULL, &allocate, &deallocate};

  int status = hpc_gpu_adreno_a6xx_create_context(num_counters, a6xx_counters,
                                                    &allocator, &context);
  if (status >= 0){
    type = 1;
    status = hpc_gpu_adreno_a6xx_start_counters(context);
    if (status >= 0){
        num_counters = 15;
        return 1;
    }
  }

  status = hpc_gpu_adreno_a5xx_create_context(num_counters, a5xx_counters,
                                       &allocator, &context);
  if (status >= 0){
//    printf("create status success\n");
    type = 0;
    status = hpc_gpu_adreno_a5xx_start_counters(context);

    if (status >= 0){
      num_counters = 11;
//      printf("create start counter success\n");
      return 0;
    }
  }

  return -1;
}

int AdrenoPipe::sample() {
  int status = -1;
  if (type == 1){
      status = hpc_gpu_adreno_a6xx_query_counters(context, values);
  }else if (type == 0){
      status = hpc_gpu_adreno_a5xx_query_counters(context, values);
  }

  return num_counters;
}

bool AdrenoPipe::stop() {
  int status = -1;
  if (type == 1){
    status = hpc_gpu_adreno_a6xx_stop_counters(context);
    if (status < 0) return false;
    status = hpc_gpu_adreno_a6xx_destroy_context(context, &allocator);
    if (status < 0) return false;
  }else if (type == 0){
    status = hpc_gpu_adreno_a5xx_stop_counters(context);
    if (status < 0) return false;
    status = hpc_gpu_adreno_a5xx_destroy_context(context, &allocator);
    if (status < 0) return false;
  }

  return status >= 0;
}

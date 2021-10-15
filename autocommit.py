# coding=utf-8
import os


def create_new_branch(branch_name: str):
    res = os.popen("git branch " + branch_name).readlines()
    print('[create_new_branch]: ' + res)


def check_out_branch(branch_name: str):
    res = os.popen("git checkout " + branch_name).readlines()
    print('[check_out_branch]: ' + str(res))
    if len(res) == 0:
        create_new_branch(branch_name)
        res = os.popen("git checkout " + branch_name).readlines()
        print('[check_out_branch]: ' + str(res))


def update_branch(branch_name = ""):
    stash = os.popen("git stash").readlines()
    print('[update_branch_stash]: ' + str(stash))
    pull = os.popen("git pull").readlines()
    print('[update_branch_pull]: ' + str(pull))
    stash = os.popen("git stash pop").readlines()
    print('[update_branch_stash_pop]: ' + str(stash))


def commit_branch(branch: str, commit_msg):
    update_branch(branch)
    os.popen("git add .")
    commit_cmd = 'git commit -m "' + commit_msg + '"'
    print(commit_cmd)
    os.popen(commit_cmd)
    push = os.popen("git push").readlines()
    print('[commit_branch]: ' + str(push))


def main():
    check_out_branch("tiny_problem")
    commit_branch("tiny_problem", "refresh newest settings")



if __name__ == "__main__":
    main()
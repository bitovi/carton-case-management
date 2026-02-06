---
name: mcp-error-handling
description: Handle MCP (Model Context Protocol) errors by stopping all operations, reporting the issue clearly, and asking the user for next steps. Use whenever any MCP tool call returns an error, fails, or produces unexpected results.
---

# Skill: MCP Error Handling

This skill defines the protocol for handling errors from MCP tools (Figma, Container, Prisma, etc.).

## When to Apply

Apply this skill **immediately** when:
- Any MCP tool call returns an error message
- An MCP tool produces unexpected or incomplete results
- Connection issues occur with MCP services
- Authentication or permission errors are encountered
- Any tool prefixed with `mcp_` fails in any way

## Error Response Protocol

When an MCP error occurs, you MUST:

### 1. Stop All Operations Immediately

- **Halt** any planned tool calls
- **Abort** multi-step workflows
- **Cancel** pending operations
- Do NOT attempt to retry or work around the error
- Do NOT proceed with the task using incomplete data

### 2. Report the Issue Clearly

Provide a clear, structured error report:

```markdown
⚠️ **MCP Error Detected**

**Tool:** [name of the MCP tool that failed]
**Operation:** [what you were trying to do]
**Error Message:** [exact error message received]

**Context:**
- [Any relevant context about what led to this error]
- [What you were attempting to accomplish]

**Impact:**
- [What cannot be completed due to this error]
- [Any data that may be incomplete or missing]
```

### 3. Ask for User Direction

After reporting, ask the user explicitly what they want to do:

```markdown
**What would you like me to do next?**

Options:
1. Retry the operation
2. Try an alternative approach (if available)
3. Skip this step and continue with the rest of the task
4. Stop and troubleshoot the MCP connection
5. Provide more information about the error

Please let me know how you'd like to proceed.
```

## Example Error Response

```markdown
⚠️ **MCP Error Detected**

**Tool:** mcp_figma_get_design_context
**Operation:** Fetching design context for node 1109:10911
**Error Message:** "Failed to fetch design data: Authentication token expired"

**Context:**
- Attempting to retrieve upvote component design from Figma
- This is needed to extract exact design values for implementation
- No design data was retrieved

**Impact:**
- Cannot extract exact spacing, colors, or typography values
- Cannot proceed with component implementation without design specs
- Design fidelity cannot be guaranteed

**What would you like me to do next?**

Options:
1. Retry the operation (may require re-authentication)
2. Use cached design data if available
3. Proceed with estimated values (not recommended)
4. Troubleshoot the Figma MCP connection
5. Provide the design values manually

Please let me know how you'd like to proceed.
```

## Common MCP Error Types

### Authentication Errors
- Token expired
- Invalid credentials
- Permission denied

**Response:** Report and ask if user wants to re-authenticate

### Connection Errors
- Network timeout
- Service unavailable
- Rate limit exceeded

**Response:** Report and ask if user wants to retry or wait

### Data Errors
- Resource not found
- Invalid node ID
- Malformed request

**Response:** Report and ask user to verify the input parameters

### Unexpected Results
- Empty or null response
- Incomplete data
- Unexpected format

**Response:** Report what was received vs. what was expected

## What NOT to Do

❌ **Don't** continue working with incomplete or missing data  
❌ **Don't** make assumptions about missing values  
❌ **Don't** retry automatically without user permission  
❌ **Don't** suppress or hide error details  
❌ **Don't** attempt workarounds without user approval  
❌ **Don't** proceed to the next step in a workflow  

## Integration with Other Skills

When working with other skills that depend on MCP tools:

- **component-set-testing**: Stop TDD workflow if Figma MCP fails
- **figma-url-router**: Halt routing if design context cannot be retrieved
- **figma-component-sync**: Abort sync if either Figma or local data is unavailable
- **cross-package-types**: Continue only if Prisma MCP operations succeed

## Recovery After Error Resolution

Once the user provides direction:

1. **If retrying:** Acknowledge and execute the retry
2. **If using alternative:** Explain the alternative approach before proceeding
3. **If skipping:** Summarize what will be skipped and its impact
4. **If stopping:** Provide summary of completed vs. incomplete work

## Testing MCP Connections

If troubleshooting is needed, suggest:

```bash
# Check MCP server status
# (command varies by MCP type)

# For Figma MCP:
# - Verify authentication in VS Code
# - Check Figma desktop app is running
# - Verify file access permissions

# For Container MCP:
# - Check Docker daemon is running
# - Verify container service accessibility

# For Prisma MCP:
# - Verify database connection
# - Check schema file location
```

## Escalation

If errors persist after user-directed retries:
1. Document the pattern of failures
2. Suggest alternative approaches that don't require MCP
3. Recommend checking MCP server logs or configuration
4. Offer to continue with manual input if applicable
